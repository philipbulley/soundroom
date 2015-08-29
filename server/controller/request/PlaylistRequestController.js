var _ = require('lodash'),
  Q = require('q'),
  FunctionUtil = require('./../../util/FunctionUtil'),
  log = require('./../../util/LogUtil'),
  Playlist = require('./../../model/db/Playlist'),
  PlaylistController = require('./../PlaylistController'),
  PlaybackController = require('./../PlaybackController'),
  TrackController = require('./../TrackController'),
  HttpUtil = require('./../../util/HttpUtil'),
  PlaylistErrorEnum = require('./../../model/enum/PlaylistErrorEnum'),
  Config = require('./../../model/Config');

function PlaylistRequestController() {
  FunctionUtil.bindAllMethods(this);
}

_.extend(PlaylistRequestController, {

  /**
   * These are Playlist fields that may be updated via HTTP PUT and PATCH requests
   */
  ALLOW_UPDATE_FIELDS: ['name', 'description']

});

PlaylistRequestController.prototype = {

  playlistController: new PlaylistController(),
  playbackController: new PlaybackController(),

  getAll: function (req, res) {
    console.log('PlaylistRequestController.getAll()');

    return this.playlistController.getAll()
      .then(function (playlists) {
        // If no playlists, return empty array, not a 404
        res.json(playlists);
      }.bind(this))
      .catch(function (err) {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.get');
      }.bind(this));
  },

  getByIdParam: function (req, res) {
    console.log('PlaylistRequestController.getByIdParam()', req.params.playlist_id);

    return this.playlistController.getById(req.params.playlist_id)
      .then(function (playlist) {
        res.json(playlist);
      }.bind(this))
      .catch(function (err) {
        switch (err.message) {
          case PlaylistErrorEnum.INVALID_ID:
            HttpUtil.sendJsonError(res, HttpUtil.status.BAD_REQUEST);
            break;

          case PlaylistErrorEnum.NOT_FOUND:
            HttpUtil.sendJsonError(res, HttpUtil.status.NOT_FOUND);
            break;

          default:
            HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
            log.formatError(err, 'PlaylistRequestController.getByIdParam');
        }
      }.bind(this));
  },

  create: function (req, res) {
    log.debug('PlaylistRequestController.create: req.body', req.body);

    return this.playlistController.create(req.body.name, req.body.description, req.body.user)
      .then(function (playlist) {
        res.json(playlist);
      }.bind(this))
      .catch(function (err) {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.create: save');
      }.bind(this));
  },

  addTrackByForeignId: function (req, res) {
    return this.playlistController.addTrackByForeignId(req.params.playlist_id, req.body.provider, req.body.foreignId)
      .then(function (playlist) {
        res.json(playlist);
      }.bind(this))
      .catch(function (err) {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.addTrackByForeignId');
      }.bind(this));
  },

  upVoteTrack: function (req, res) {
    return this.playlistController.upVoteTrack(req.params.playlist_id, req.params.track_id)
      .then(function (playlist) {
        res.json(playlist);
      }.bind(this))
      .catch(function (err) {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.upVoteTrack');
      }.bind(this));
  },

  /**
   * Update segments / fields. Can be used with PUT or PATCH.
   * Add fields names to `EpisodeController.ALLOW_UPDATE_FIELDS` to enable
   * update via this method.
   *
   * @returns {Q.Promise}
   */
  updateByIdParam: function (req, res) {
    console.log('PlaylistRequestController.updateByIdParam()', req.params.playlist_id, req.body);

    var updateObject = _.pick(req.body, PlaylistRequestController.ALLOW_UPDATE_FIELDS);

    return this.playlistController.updateById(req.params.playlist_id, updateObject)
      .then(function (playlist) {
        if (!playlist)
          return HttpUtil.sendJsonError(res, HttpUtil.status.NOT_FOUND);

        res.json(playlist);
      }.bind(this))
      .catch(function (err) {
        switch (err.message) {
          case PlaylistErrorEnum.INVALID_ID:
            HttpUtil.sendJsonError(res, HttpUtil.status.BAD_REQUEST);
            break;

          case PlaylistErrorEnum.NOT_FOUND:
            HttpUtil.sendJsonError(res, HttpUtil.status.NOT_FOUND);
            break;

          default:
            HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
            log.formatError(err, 'PlaylistRequestController.updateByIdParam');
        }
      }.bind(this))
  },

  deleteByIdParam: function (req, res) {
    console.log('PlaylistRequestController.deleteByIdParam()', req.params.playlist_id, req.body);

    return this.playlistController.deleteById(req.params.playlist_id)
      .then(function (playlist) {
        res.sendStatus(HttpUtil.status.NO_CONTENT);
      }.bind(this))
      .catch(function (err) {
        switch (err.message) {
          case PlaylistErrorEnum.INVALID_ID:
            HttpUtil.sendJsonError(res, HttpUtil.status.BAD_REQUEST);
            break;

          case PlaylistErrorEnum.NOT_FOUND:
            HttpUtil.sendJsonError(res, HttpUtil.status.NOT_FOUND);
            break;

          default:
            HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
            log.formatError(err, 'PlaylistRequestController.deleteByIdParam');
        }
      }.bind(this))
  },

  play: function (req, res) {
    return this.playbackController.play(req.params.playlist_id)
      .then(function (playlistTrack) {
        res.json(playlistTrack);
      });
  }

};

module.exports = PlaylistRequestController;
