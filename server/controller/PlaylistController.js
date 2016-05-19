import _ from 'lodash';
import db from './../model/db';
import FunctionUtil from './../util/FunctionUtil';
import log from './../util/LogUtil';
import PlaylistErrorEnum from './../model/enum/PlaylistErrorEnum';
import Q from 'q';
import trackController from './TrackController';
import TrackErrorEnum from './../model/enum/TrackErrorEnum';
import SocketService from './../service/SocketService';
import PlaylistTracksChangeActionEnum from './../model/enum/PlaylistTracksChangeActionEnum';

class PlaylistController {

  constructor() {
    FunctionUtil.bindAllMethods(this);
  }

  getAll() {
    console.log('PlaylistController.getAll()');

    // Return a non-deeply populated object without the `tracks` property.
    // `tracks` and deeply populated singular playlist instances should be obtained via `PlaylistController.getById()`
    return db.Playlist.findQ()
      .then(playlists => playlists.map(playlist => _.omit(playlist.toObject(), 'tracks')));
  }

  getById(id) {
    console.log('PlaylistController.getById()', id);

    return db.Playlist.findByIdPopulateQ(id)
      .then((playlist) => {
        if (!playlist)
          throw new Error(PlaylistErrorEnum.NOT_FOUND);

        return playlist;
      })
      .catch((err) => {
        if (err.message !== PlaylistErrorEnum.INVALID_ID && err.message !== PlaylistErrorEnum.NOT_FOUND)
          log.formatError(err, 'PlaylistController.getById');

        // Rethrow
        throw err;
      });
  }

  create(name, description, user) {
    const playlist = db.Playlist();
    playlist.name = name;
    playlist.description = description;
    playlist.createdBy = user;

    return playlist.saveQ();
  }

  /**
   * @param {User} user
   * @param {string} provider     Use a value that exists in ProviderEnum
   * @param {string} foreignId    The ID on the provider's platform
   */
  addTrackByForeignId(user, playlistId, provider, foreignId) {
    console.log('PlaylistController.addTrackByForeignId:', provider, foreignId);

    // Check if track already exists as a Track model in the DB (ie. a user has added it before)
    return trackController.getByForeignId(provider, foreignId)
      .then((track) => {
        log.debug('PlaylistController.addTrackByForeignId: track already exists');
        return track;
      })
      .catch((err) => {
        // The track isn't yet stored in our DB, time to create it
        if (err.message === TrackErrorEnum.NOT_FOUND){
          return trackController.createByForeignId(provider, foreignId);
        }

        log.formatError(err, 'PlaylistController.addTrackByForeignId');

        // Rethrow
        throw err;
      })
      .then((track) => {
        log.debug('PlaylistController.addTrackByForeignId: READY TO ADD TRACK TO PLAYLIST!');

        return this.addTrackToPlaylist(user, playlistId, track.id);
      });
  }

  /**
   * Adds a track to a playlist and upvotes it.
   *
   * @param {User} user
   * @param {string} playlistId
   * @param {string} trackId
   * @returns {Promise<PlaylistTrack>}
   */
  addTrackToPlaylist(user, playlistId, trackId) {
    console.log('PlaylistController.addTrackToPlaylist:', playlistId, trackId);

    let playlist, track;

    return this.getById(playlistId)
      .then(_playlist => {
        playlist = _playlist;

        console.log('PlaylistController.addTrackToPlaylist: Found playlist:', playlist);

        return trackController.getById(trackId);
      })
      .then(_track => {
        track = _track;
        // TODO: Ensure track doesn't exist in Playlist.tracks, if not in, create PlaylistTrack

        console.log('PlaylistController.addTrackToPlaylist: Found track:', track);

        // TODO: Add user to addPlaylistTrack
        return playlist.addPlaylistTrack(track/*, user*/);
      })
      .then(playlistTrack => this.upVoteTrack(user, playlist.id, track.id, false))
      .then(playlist => {

        const playlistTrack = playlist.getPlaylistTrackByIdOrTrackId(track.id);

        SocketService.emitTracksChange(
          PlaylistTracksChangeActionEnum.ADD,
          playlist._id,
          playlistTrack,
          playlist.getPlaylistTrackIds()
        );

        return playlistTrack;
      });
  }

  /**
   * UpVote a PlaylistTrack and return a playlist with correctly sorted tracks.
   *
   * @param {User} user
   * @param {string} playlistId
   * @param {string} trackId      A trackId or a playlistTrackId
   * @param {boolean} [emitSocketEvent=true]   Should this action emit a socket event notifying clients about the upvote?
   * @returns {Promise<Playlist>}   Promise resolved with playlist whose tracks are freshly sorted taking this upVote in to account
   */
  upVoteTrack(user, playlistId, trackId, emitSocketEvent = true) {
    return this.getById(playlistId)
      .then(playlist => playlist.upVoteTrack(user, trackId))
      .then(playlist => {
        if (emitSocketEvent) {
          SocketService.emitTracksChange(
            PlaylistTracksChangeActionEnum.UP_VOTE,
            playlist._id,
            playlist.getPlaylistTrackByIdOrTrackId(trackId),
            playlist.getPlaylistTrackIds()
          );
        }

        return playlist;
      });
  }

  /**
   * Updates the playlist with id with the key/values in the updateObj
   *
   * @param id            The id of the playlist
   * @param updateObj     These should be pre-sanitized before passing
   */
  updateById(id, updateObj) {
    return db.Playlist.findByIdPopulateQ(id)
      .then((playlist) => {
        if (!playlist)
          throw new Error(PlaylistErrorEnum.NOT_FOUND);

        // Not sanitizing update keys, this should be done before
        for (const key in updateObj) {
          if (updateObj.hasOwnProperty(key)) {
            playlist[key] = updateObj[key];
          }
        }

        return playlist.savePopulateQ();
      })
      .catch((err) => {
        if (err.message !== PlaylistErrorEnum.INVALID_ID && err.message !== PlaylistErrorEnum.NOT_FOUND)
          log.formatError(err, 'PlaylistController.updateById');

        // Rethrow
        throw err;
      });
  }

  deleteById(id) {
    log.debug('PlaylistController.deleteByIdParam', id);

    if (!db.Playlist.isValidId(id))
      return Q.reject(new Error(PlaylistErrorEnum.INVALID_ID));

    return db.Playlist.findByIdAndRemoveQ(id)
      .then((playlist) => {
        if (!playlist)
          throw new Error(PlaylistErrorEnum.NOT_FOUND);
        else
          return playlist;
      })
      .catch((err) => {
        if (err.message !== PlaylistErrorEnum.NOT_FOUND)
          log.formatError(err, 'PlaylistController.updateById');

        // Rethrow
        throw err;
      });
  }

  /**
   * Gets the PlaylistTrack that is/will/should be playing.
   *
   * @param playlistId
   * @returns {Promise<TResult>|PromiseLike<TResult>|Promise.<null>}
   */
  getCurrentPlaylistTrack(playlistId) {
    return this.getById(playlistId)
      .then(playlist => playlist.tracks && playlist.tracks.length ? playlist.tracks[0] : null);
  }

  /**
   * Sends the track that is/will/should be playing back to the bottom of the playlist.
   *
   * @param playlistId
   * @returns {Promise<Playlist>}
   */
  resetCurrentPlaylistTrack(playlistId) {
    return this.getById(playlistId)
      .then(playlist => playlist.resetCurrentPlaylistTrack())
      .then(playlist => {
        SocketService.emitTracksChange(
          PlaylistTracksChangeActionEnum.COMPLETE,
          playlist._id,
          playlist.tracks[playlist.tracks.length - 1],
          playlist.getPlaylistTrackIds()
        );

        return playlist;
      });
  }

}

export default new PlaylistController();
