import db from './../model/db';
import FunctionUtil from './../util/FunctionUtil';
import log from './../util/LogUtil';
import PlaylistErrorEnum from './../model/enum/PlaylistErrorEnum';
import Q from 'q';
import TrackController from './TrackController';
import TrackErrorEnum from './../model/enum/TrackErrorEnum';


class PlaylistController {

  currentTrack = -1
  trackController = null

  constructor () {
    FunctionUtil.bindAllMethods(this);

    this.trackController = new TrackController();
  }

  getAll () {
    console.log('PlaylistController.getAll()');

    return db.Playlist.findPopulateQ();
  }

  getById (id) {
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

  create (name, description, user) {
    const playlist = db.Playlist();
    playlist.name = name;
    playlist.description = description;
    playlist.createdBy = user;

    return playlist.saveQ();
  }

  /**
   *
   * @param {string} provider     Use a value that exists in ProviderEnum
   * @param {string} foreignId    The ID on the provider's platform
   */
  addTrackByForeignId (playlistId, provider, foreignId) {
    console.log('PlaylistController.addTrackByForeignId:', provider, foreignId);

    // Check if track already exists as a Track model in the DB (ie. a user has added it before)
    return this.trackController.getByForeignId(provider, foreignId)
      .then((track) => {
        log.debug('PlaylistController.addTrackByForeignId: track already exists');
        return track;
      })
      .catch((err) => {
        // The track isn't yet stored in our DB, time to create it
        if (err.message === TrackErrorEnum.NOT_FOUND)
          return this.trackController.createByForeignId(provider, foreignId);

        log.formatError(err, 'PlaylistController.addTrackByForeignId');

        // Rethrow
        throw err;
      })
      .then((track) => {
        log.debug('PlaylistController.addTrackByForeignId: READY TO ADD TRACK TO PLAYLIST!');

        return this.addTrackToPlaylist(playlistId, track.id);
      });
  }

  /**
   * Adds a track to a playlist and upvotes it.
   *
   * @param playlistId
   * @param trackId
   * @returns {Promise<TResult>}
   */
  addTrackToPlaylist (playlistId, trackId/*, user*/) {
    console.log('PlaylistController.addTrackToPlaylist:', playlistId, trackId);

    let playlist, track;

    return this.getById(playlistId)
      .then((_playlist) => {
        playlist = _playlist;

        console.log('PlaylistController.addTrackToPlaylist: Found playlist:', playlist);

        return this.trackController.getById(trackId);
      })
      .then((_track) => {
        track = _track;
        // TODO: ADD TRACK TO PLAYLIST
        // TODO: Ensure track doesn't exist in Playlist.tracks, if not in, create PlaylistTrack

        console.log('PlaylistController.addTrackToPlaylist: Found track:', track);

        return playlist.addPlaylistTrack(track/*, user*/);
      })
      .then((playlistTrack) => {
        console.log('PlaylistController.addTrackToPlaylist: Found playlistTrack:', playlistTrack);

        return this.upVoteTrack(playlist.id, track.id);
      })
      .then((playlistTrack) => {
        console.log('PlaylistController.addTrackToPlaylist: Found playlistTrack:', playlistTrack);

        // Return fresh playlist
        return this.getById(playlist.id);
      });
  }

  /**
   *
   * @param playlistId
   * @param trackId
   * @returns {*}   Promise resolved with playlistTrack
   */
  upVoteTrack (playlistId, trackId) {
    return this.getById(playlistId)
      .then((playlist) => {
        // TODO: send change via socket
        return playlist.upVoteTrack(trackId);
      });
  }

  /**
   * Updates the playlist with id with the key/values in the updateObj
   *
   * @param id            The id of the playlist
   * @param updateObj     These should be pre-sanitized before passing
   */
  updateById (id, updateObj) {
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

  deleteById (id) {
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

  getNextTrackForPlayback (playlistId) {
    this.currentTrack++;
    return this.getById(playlistId)
      .then((playlist) => {
        if (this.currentTrack === playlist.tracks.length) {
          this.currentTrack = -1;
          return null;
        }
        return playlist.tracks[this.currentTrack];
      });
  }
}

export default PlaylistController;
