import _ from 'lodash';
import mongooseQ from 'mongoose-q';
import Q from 'q';
import DateFields from '../plugin/DateFields';
import PlaylistErrorEnum from '../../enum/PlaylistErrorEnum';
import UserErrorEnum from '../../enum/UserErrorEnum';
import mongooseDeepPopulate from 'mongoose-deep-populate';


const mongoose = mongooseQ();
const deepPopulate = mongooseDeepPopulate(mongoose);
const Schema = mongoose.Schema;

export default function create() {
  const upVoteSchema = new Schema({
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true}
  });

  upVoteSchema.plugin(DateFields);

  const playlistTrackSchema = new Schema({
    track: {type: Schema.Types.ObjectId, ref: 'Track'},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    upVotes: [upVoteSchema],
    playCompleted: {type: Schema.Types.Date, default: null}
  });

  playlistTrackSchema.plugin(DateFields);

  const playlistSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    tracks: [playlistTrackSchema],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}    // TODO: required: true when implemented users
  });

  playlistSchema.plugin(DateFields);
  playlistSchema.plugin(deepPopulate);


  _.extend(playlistSchema.methods, {

    /**
     * Use this save method instead of `playlist.saveQ()` if you need the returned playlist to be populated
     * @returns {Q.Promise}
     */
    savePopulateQ: function () {
      return this.saveQ()
        .then(playlist => playlist.deepPopulate(playlistSchema.statics.POPULATE_FIELDS));
    },

    ///**
    // * TODO: Add unit test
    // * @returns {Q.Promise}
    // */
    //getPlaylistTrackById: function (trackId) {
    //
    //  // DEBUG: Say there's no track so we then must create a new one
    //  throw new Error(PlaylistErrorEnum.TRACK_NOT_IN_PLAYLIST);
    //
    //  return this.findPopulateQ({'tracks.id': trackId})
    //    .then(function (tracks) {
    //      if (!tracks || !tracks.length)
    //        throw new Error(TrackErrorEnum.NOT_FOUND);
    //
    //      return tracks[0];
    //    });
    //},

    /**
     * Adds track to playlist if it's not in there already
     *
     * @param {User} user
     * @param {Track} track
     * @returns {Q.Promise}   The added or existing track
     */
    addPlaylistTrack: function (user, track) {

      let playlistTrack = this.getPlaylistTrackByIdOrTrackId(track.id);

      if (!!playlistTrack) {
        return playlistTrack;
      }

      playlistTrack = {};
      playlistTrack.trackId = track.id;
      playlistTrack.track = track;
      playlistTrack.createdBy = user._id;
      // Add up votes in a separate step

      console.log('Playlist.addPlaylistTrack:', this.id);

      this.tracks.addToSet(playlistTrack);

      return this.savePopulateQ()
        .then(playlist => {
          playlistTrack = this.getPlaylistTrackByIdOrTrackId(track.id);
          console.log('Playlist.addPlaylistTrack: playlist after savePopulateQ:', playlist.toObject(), playlistTrack.toObject());
          return playlistTrack;
        });
    },

    /**
     * Creates a new up vote on an existing track.
     *
     * @param {User} user
     * @param {string} trackId
     * @returns {Promise<Playlist>}
     */
    upVoteTrack: function (user, trackId) {
      // console.log('Playlist.upVoteTrack()', userId, trackId);

      const playlistTrack = this.getPlaylistTrackByIdOrTrackId(trackId);

      if (!playlistTrack) {
        throw new Error(PlaylistErrorEnum.TRACK_NOT_IN_PLAYLIST);
      }

      const userAlreadyVoted = _.find(playlistTrack.upVotes, upVote => upVote.createdBy._id.toString() === user._id.toString());

      if (userAlreadyVoted) {
        throw new Error(PlaylistErrorEnum.DUPLICATE_USER_UP_VOTE);
      }

      // DEBUG!! KILL ALL UP VOTES IN PLAYLIST!
      // this.tracks.forEach(track => track.upVotes = []);

      playlistTrack.upVotes.addToSet({
        createdBy: user._id
      });

      // console.log('Playlist.upVoteTrack:', playlistTrack);

      // Save first before sorting so timestamps are up-to-date
      return this.savePopulateQ()
        .then(playlist => {
          // Ensure that even after sorting, the track at [0] remains at [0]. It's the current track and no power
          // in the world can move it.
          const first = this.tracks[0];

          this.tracks.sort(playlistTrackSortCompare);
          this.tracks = _.without(this.tracks, first);
          this.tracks.unshift(first);

          // console.log('Playlist.upVoteTrack: tracks after sort:', this.tracks);
          return this.savePopulateQ();
        });
    },

    /**
     * Sends the track that is/will/should be playing back to the bottom of the playlist.
     *
     * @returns {*}
     */
    resetCurrentPlaylistTrack: function () {
      // console.log('Playlist.resetCurrentPlaylistTrack(): Before:', this.tracks.toObject());

      // Remove all up votes from current track
      this.tracks[0].upVotes = [];
      this.tracks[0].playCompleted = new Date();

      // Save first before sorting so timestamps are up-to-date
      return this.savePopulateQ()
        .then(playlist => {
          this.tracks.sort(playlistTrackSortCompare);

          // console.log('Playlist.resetCurrentPlaylistTrack: After:', this.tracks.toObject());

          return this.savePopulateQ();
        });
    },

    /**
     * Deletes a track already in the playlist
     *
     * @param user
     * @param trackId
     * @returns {Promise<PlaylistTrack>}
     */
    deleteTrack: function (user, trackId) {
      const playlistTrack = this.getPlaylistTrackByIdOrTrackId(trackId);

      if (!playlistTrack) {
        throw new Error(PlaylistErrorEnum.TRACK_NOT_IN_PLAYLIST);
      }

      if (!this.canUserDeleteTrack(user, playlistTrack)) {
        throw new Error(UserErrorEnum.NOT_ALLOWED);
      }

      playlistTrack.remove();

      return this.savePopulateQ()
        .then(playlist => playlistTrack);
    },

    canUserDeleteTrack: function (user, playlistTrack) {
      // TODO: Allow admins (when implemented) to delete tracks (also in front-end PlaylistService.canUserDeleteTrack())
      // console.log('Playlist.canUserDeleteTrack():', playlistTrack);
      return playlistTrack.createdBy.id === user.id;
    },

    /**
     * Gets a Playlist Track by its id or the id of it's actual track.
     *
     * @param trackId
     * @returns {*}
     */
    getPlaylistTrackByIdOrTrackId: function (trackIdOrPlaylistTrackId) {
      // console.log('Playlist.getPlaylistTrackByIdOrTrackId():', trackIdOrPlaylistTrackId);
      return _.find(this.tracks, (playlistTrack) => {
        return playlistTrack.id == trackIdOrPlaylistTrackId || playlistTrack.track.toObject()._id == trackIdOrPlaylistTrackId;
      });
    },

    /**
     * Gets an array of PlaylistTrack IDs based on their ordering within the playlist
     * @returns {string[]}
     */
    getPlaylistTrackIds: function () {
      return this.tracks.map(playlistTrack => playlistTrack._id);
    }

  });

  /**
   * Use with `Array.prototype.sort` to sort playlist tracks by up votes.
   *
   * TODO: Unit test required!
   *
   * @param {PlaylistTrack} a
   * @param {PlaylistTrack} b
   * @returns {number}
   */
  function playlistTrackSortCompare(a, b) {
    if (a.upVotes.length > b.upVotes.length) {
      // a has more up votes, so should appear before b in the playlist
      return -1;
    } else if (a.upVotes.length < b.upVotes.length) {
      // a has fewer up votes, so should appear after b in the playlist
      return 1;
    } else {
      if (!a.upVotes.length && !b.upVotes.length) {
        const timestampA = a.playCompleted || a.created,
          timestampB = b.playCompleted || b.created;

        // Neither track has any up votes, so compare on create/completed timestamp
        if (timestampA < timestampB) {
          // a was create/completed before b, so should appear before b in the playlist
          return -1;
        } else if (timestampA > timestampB) {
          // a was create/completed after b, so should appear after b in the playlist
          return 1;
        } else {
          // Unlikely unless a batch operation updated all 0 up-voted tracks at the same time :)
          return 0;
        }
      } else if (a.upVotes[a.upVotes.length - 1].created < b.upVotes[b.upVotes.length - 1].created) {
        // a was up-voted before b, so should appear before b in the playlist
        return -1;
      } else if (a.upVotes[a.upVotes.length - 1].created > b.upVotes[b.upVotes.length - 1].created) {
        // a was up-voted after b, so should appear after b in the playlist
        return 1;
      } else {
        // Unlikely unless two tracks were up-voted at the same time :/
        return 0;
      }
    }
  }

  _.extend(playlistSchema.statics, {

    /**
     * These fields need to be populated by a document from another database model. String of fields names, separated by spaces.
     */
    POPULATE_FIELDS: 'createdBy tracks.track tracks.track.createdBy tracks.createdBy tracks.upVotes tracks.upVotes.createdBy tracks.track.artists tracks.track.album',

    /**
     * Checks if the format of the ID is valid
     *
     * @param id
     */
    isValidId: function (id) {
      return mongoose.Types.ObjectId.isValid(id);
    },

    /**
     * Use this find method instead of `Playlist.findById()` if you need the returned playlist to be populated
     * with external documents.
     *
     * @param id
     * @param fields
     * @param options
     * @returns {Q.Promise}     Promise resolved with a single Playlist or null
     */
    findByIdPopulateQ: function (id, fields, options) {
      if (!this.isValidId(id))
        return Q.reject(new Error(PlaylistErrorEnum.INVALID_ID));

      return this.findById(id, fields, options)
        .deepPopulate(this.POPULATE_FIELDS)
        .execQ();
    },

    /**
     * Use this find method instead of `Playlist.find()` if you need the returned playlist to be populated
     * with external documents.
     *
     * @param id
     * @param fields
     * @param options
     * @returns {Q.Promise}     Promise resolved with an array of Playlists or an empty array if no matches.
     */
    findPopulateQ: function (conditions, fields, options) {
      //log.debug( 'Playlist.findPopulateQ:', conditions, fields, options );

      return this.find(conditions, fields, options)
        .deepPopulate(this.POPULATE_FIELDS)
        .execQ();
    }

  });

  return playlistSchema;
}
