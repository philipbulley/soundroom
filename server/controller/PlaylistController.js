var _ = require('lodash'),
  Q = require('q'),
  FunctionUtil = require('./../util/FunctionUtil'),
  log = require('./../util/LogUtil'),
  Playlist = require('./../model/db/Playlist'),
  TrackController = require('./TrackController'),
  PlaylistErrorEnum = require('./../model/enum/PlaylistErrorEnum'),
  TrackErrorEnum = require('./../model/enum/TrackErrorEnum'),
  Config = require('./../model/Config');

function PlaylistController() {
  FunctionUtil.bindAllMethods(this);

  this.trackController = new TrackController();
}

_.extend(PlaylistController, {});

PlaylistController.prototype = {
  trackController: null,

  getAll: function () {
    console.log('PlaylistController.getAll()');

    return Playlist.findPopulateQ();
  },

  getById: function (id) {
    console.log('PlaylistController.getById()', id);

    return Playlist.findByIdPopulateQ(id)
      .then(function (playlist) {
        if (!playlist)
          throw new Error(PlaylistErrorEnum.NOT_FOUND);

        return playlist;
      }.bind(this))
      .catch(function (err) {
        if (err.message !== PlaylistErrorEnum.INVALID_ID && err.message !== PlaylistErrorEnum.NOT_FOUND)
          log.formatError(err, 'PlaylistController.getById');

        // Rethrow
        throw err;
      }.bind(this));
  },

  create: function (name, description, user) {
    var playlist = new Playlist();
    playlist.name = name;
    playlist.description = description;
    playlist.createdBy = user;

    return playlist.saveQ();
  },

  /**
   *
   * @param {string} provider     Use a value that exists in ProviderEnum
   * @param {string} foreignId    The ID on the provider's platform
   */
  addTrackByForeignId: function (playlistId, provider, foreignId) {
    console.log('PlaylistController.addTrackByForeignId:', provider, foreignId);

    // Check if track already exists as a Track model in the DB (ie. a user has added it before)
    return this.trackController.getByForeignId(provider, foreignId)
      .then(function (track) {
        log.debug('PlaylistController.addTrackByForeignId: track already exists');
        return track;
      }.bind(this))
      .catch(function (err) {
        // The track isn't yet stored in our DB, time to create it
        if (err.message === TrackErrorEnum.NOT_FOUND)
          return this.trackController.createByForeignId(provider, foreignId);

        log.formatError(err, 'PlaylistController.addTrackByForeignId');

        // Rethrow
        throw err;
      }.bind(this))
      .then(function (track) {
        log.debug('PlaylistController.addTrackByForeignId: READY TO ADD TRACK TO PLAYLIST!');

        return this.addTrackToPlaylist(playlistId, track.id);
      }.bind(this))
  },

  /**
   * Adds a track to a playlist and upvotes it.
   *
   * @param playlistId
   * @param trackId
   * @returns {Promise<TResult>}
   */
  addTrackToPlaylist: function (playlistId, trackId/*, user*/) {
    console.log('PlaylistController.addTrackToPlaylist:', playlistId, trackId);

    var playlist, track;

    return this.getById(playlistId)
      .then(function (_playlist) {
        playlist = _playlist;

        console.log('PlaylistController.addTrackToPlaylist: Found playlist:', playlist);

        return this.trackController.getById(trackId);
      }.bind(this))
      .then(function (_track) {
        track = _track;
        // TODO: ADD TRACK TO PLAYLIST
        // TODO: Ensure track doesn't exist in Playlist.tracks, if not in, create PlaylistTrack

        console.log('PlaylistController.addTrackToPlaylist: Found track:', track);

        return playlist.addPlaylistTrack(track/*, user*/);
      }.bind(this))
      .then(function (playlistTrack) {
        console.log('PlaylistController.addTrackToPlaylist: Found playlistTrack:', playlistTrack);

        return this.upVoteTrack(playlist.id, track.id);
      }.bind(this));
  },

  upVoteTrack: function (playlistId, trackId) {
    return this.getById(playlistId)
      .then(function (playlist) {
        // TODO: Search for PlaylistTrack, add vote, send change via socket
        return playlist.upVoteTrack(trackId);
      }.bind(this));
  },

  /**
   * Updates the playlist with id with the key/values in the updateObj
   *
   * @param id            The id of the playlist
   * @param updateObj     These should be pre-sanitized before passing
   */
  updateById: function (id, updateObj) {
    return Playlist.findByIdPopulateQ(id)
      .then(function (playlist) {
        if (!playlist)
          throw new Error(PlaylistErrorEnum.NOT_FOUND);

        // Not sanitizing update keys, this should be done before
        for (var key in updateObj)
          playlist[key] = updateObj[key];

        return playlist.savePopulateQ();
      }.bind(this))
      .catch(function (err) {
        if (err.message !== PlaylistErrorEnum.INVALID_ID && err.message !== PlaylistErrorEnum.NOT_FOUND)
          log.formatError(err, 'PlaylistController.updateById');

        // Rethrow
        throw err;
      }.bind(this));
  },

  deleteById: function (id) {
    log.debug('PlaylistController.deleteByIdParam', id);

    if (!Playlist.isValidId(id))
      return Q.reject(new Error(PlaylistErrorEnum.INVALID_ID));

    return Playlist.findByIdAndRemoveQ(id)
      .then(function (playlist) {
        if (!playlist)
          throw new Error(PlaylistErrorEnum.NOT_FOUND);
        else
          return playlist;
      }.bind(this))
      .catch(function (err) {
        if (err.message !== PlaylistErrorEnum.NOT_FOUND)
          log.formatError(err, 'PlaylistController.updateById');

        // Rethrow
        throw err;
      }.bind(this));
  }
};

module.exports = PlaylistController;
