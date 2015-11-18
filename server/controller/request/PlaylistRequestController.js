import _ from 'lodash';
// import Q from 'q';
import FunctionUtil from './../../util/FunctionUtil';
import log from './../../util/LogUtil';
// import Playlist from './../../model/db/Playlist';
import PlaylistController from './../PlaylistController';
import PlaybackController from './../PlaybackController';
// import TrackController from './../TrackController';
import HttpUtil from './../../util/HttpUtil';
import PlaylistErrorEnum from './../../model/enum/PlaylistErrorEnum';
// import Config from './../../model/Config';

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
      .then((playlists) => {
        // If no playlists, return empty array, not a 404
        res.json(playlists);
      })
      .catch((err) => {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.get');
      });
  },

  getByIdParam: function (req, res) {
    console.log('PlaylistRequestController.getByIdParam()', req.params.playlist_id);

    return this.playlistController.getById(req.params.playlist_id)
      .then((playlist) => {
        res.json(playlist);
      })
      .catch((err) => {
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
      });
  },

  create: function (req, res) {
    log.debug('PlaylistRequestController.create: req.body', req.body);

    return this.playlistController.create(req.body.name, req.body.description, req.body.user)
      .then((playlist) => {
        res.json(playlist);
      })
      .catch((err) => {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.create: save');
      });
  },

  addTrackByForeignId: function (req, res) {
    return this.playlistController.addTrackByForeignId(req.params.playlist_id, req.body.provider, req.body.foreignId)
      .then((playlist) => {
        res.json(playlist);
      })
      .catch((err) => {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.addTrackByForeignId');
      });
  },

  upVoteTrack: function (req, res) {
    return this.playlistController.upVoteTrack(req.params.playlist_id, req.params.track_id)
      .then((playlist) => {
        res.json(playlist);
      })
      .catch((err) => {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.upVoteTrack');
      });
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

    const updateObject = _.pick(req.body, PlaylistRequestController.ALLOW_UPDATE_FIELDS);

    return this.playlistController.updateById(req.params.playlist_id, updateObject)
      .then((playlist) => {
        if (!playlist)
          return HttpUtil.sendJsonError(res, HttpUtil.status.NOT_FOUND);

        res.json(playlist);
      })
      .catch((err) => {
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
      });
  },

  deleteByIdParam: function (req, res) {
    console.log('PlaylistRequestController.deleteByIdParam()', req.params.playlist_id, req.body);

    return this.playlistController.deleteById(req.params.playlist_id)
      .then((playlist) => {
        res.sendStatus(HttpUtil.status.NO_CONTENT);
      })
      .catch((err) => {
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
      });
  },

  play: function (req, res) {
    return this.playbackController.play(req.params.playlist_id)
      .then((playlistTrack) => {
        res.json(playlistTrack);
      });
  }

};

// module.exports = PlaylistRequestController;
export default PlaylistRequestController;
// export { PlaylistRequestController };
