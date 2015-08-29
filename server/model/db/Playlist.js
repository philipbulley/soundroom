var
  _ = require('lodash'),
  mongoose = require('mongoose-q')(),
  Q = require('q'),
  log = require('./../../util/LogUtil'),
  MongooseUtil = require('./../../util/MongooseUtil'),
  Modified = require('./plugin/Modified'),
  Schema = mongoose.Schema,
  PlaylistErrorEnum = require('./../enum/PlaylistErrorEnum');


function create() {
  var playlistTrackSchema = new Schema({
    track: {type: Schema.Types.ObjectId, ref: 'Track'},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},    // TODO: required: true when implemented users
    upVotes: [{type: Schema.Types.ObjectId, ref: 'User'}]
  });

  var playlistSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    tracks: [playlistTrackSchema],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},    // TODO: required: true when implemented users
    created: {type: Date}
  });

  playlistSchema.plugin(Modified);

  _.extend(playlistSchema.methods, {

    /**
     * Use this save method instead of `episode.saveQ()` if you need the returned episode to be populated
     * @returns {Q.Promise}
     */
    savePopulateQ: function () {
      return this.saveQ()
        .then(function (playlist) {
          return playlist.populateQ(playlistSchema.statics.POPULATE_FIELDS)
        });
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
    //    }.bind(this));
    //},

    /**
     * Adds track to playlist if it's not in there already
     *
     * @param track
     * @param user
     * @returns {Q.Promise}   The added or existing track
     */
    addPlaylistTrack: function (track, user) {

      var playlistTrack = this.getPlaylistTrackByTrackId(track.id);

      if (!!playlistTrack) {
        return playlistTrack;
      }

      playlistTrack = {};
      playlistTrack.trackId = track.id;
      playlistTrack.track = track;
      //playlistTrack.createdBy = null;   // TODO: Add user
      // Add upvotes in a separate step

      console.log('Playlist.addPlaylistTrack:', this.id);

      this.tracks.addToSet(playlistTrack);

      return this.savePopulateQ()
        .then(function (playlist) {
          return this.getPlaylistTrackByTrackId(track.id);
        }.bind(this));
    },

    upVoteTrack: function (trackId, user) {

    },

    getPlaylistTrackByTrackId: function (trackId) {
      return _.find(this.tracks, function (playlistTrack) {
        return playlistTrack.track.toObject()._id == trackId;
      });
    }

  });

  _.extend(playlistSchema.statics, {

    /**
     * These fields need to be populated by a document from another database model. String of fields names, separated by spaces.
     */
    POPULATE_FIELDS: 'createdBy tracks.track tracks.createdBy tracks.upVotes',

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
     * @returns {Q.Promise}     Promised resolved with a single Episode or null
     */
    findByIdPopulateQ: function (id, fields, options) {
      if (!this.isValidId(id))
        return Q.reject(new Error(PlaylistErrorEnum.INVALID_ID));

      return this.findById(id, fields, options)
        .populate(this.POPULATE_FIELDS)
        .execQ();
    },

    /**
     * Use this find method instead of `Playlist.find()` if you need the returned episode to be populated
     * with external documents.
     *
     * @param id
     * @param fields
     * @param options
     * @returns {Q.Promise}     Promised resolved with an array of Episodes or an empty array if no matches.
     */
    findPopulateQ: function (conditions, fields, options) {
      //log.debug( 'Playlist.findPopulateQ:', conditions, fields, options );

      return this.find(conditions, fields, options)
        .populate(this.POPULATE_FIELDS)
        .execQ();
    }

  });

  return playlistSchema;
}


// Export!
MongooseUtil.exportModuleModel('appInstance', 'Playlist', create, module);
