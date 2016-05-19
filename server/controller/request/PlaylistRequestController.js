import _ from 'lodash';
import log from './../../util/LogUtil';
import playlistController from './../PlaylistController';
import HttpUtil from './../../util/HttpUtil';
import PlaylistErrorEnum from './../../model/enum/PlaylistErrorEnum';
// import Config from './../../model/Config';

class PlaylistRequestController {
  /**
   * These are Playlist fields that may be updated via HTTP PUT and PATCH requests
   */
  static ALLOW_UPDATE_FIELDS = ['name', 'description'];

  getAll (req, res) {
    console.log('PlaylistRequestController.getAll()');

    return playlistController.getAll()
      .then((playlists) => {
        // If no playlists, return empty array, not a 404
        res.json(playlists);
      })
      .catch((err) => {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.get');
      });
  }

  getByIdParam (req, res) {
    console.log('PlaylistRequestController.getByIdParam()', req.params.playlist_id);

    return playlistController.getById(req.params.playlist_id)
      .then((playlist) => res.json(playlist))
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
  }

  create (req, res) {
    log.debug('PlaylistRequestController.create: req.body', req.body);

    return playlistController.create(req.body.name, req.body.description, req.body.user)
      .then((playlist) => {
        res.json(playlist);
      })
      .catch((err) => {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.create: save');
      });
  }

  addTrackByForeignId (req, res) {
    return playlistController.addTrackByForeignId(req.user, req.params.playlist_id, req.body.provider, req.body.foreignId)
      .then((playlist) => {
        res.json(playlist);
      })
      .catch((err) => {
        HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
        log.formatError(err, 'PlaylistRequestController.addTrackByForeignId');
      });
  }

  /**
   * Update playlist fields. Can be used with PUT or PATCH.
   * Add fields names to `PlaylistRequestController.ALLOW_UPDATE_FIELDS` to enable
   * update via this method.
   *
   * @returns {Q.Promise}
   */
  updateByIdParam (req, res) {
    console.log('PlaylistRequestController.updateByIdParam()', req.params.playlist_id, req.body);

    const updateObject = _.pick(req.body, PlaylistRequestController.ALLOW_UPDATE_FIELDS);

    return playlistController.updateById(req.params.playlist_id, updateObject)
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
  }

  deleteByIdParam (req, res) {
    console.log('PlaylistRequestController.deleteByIdParam()', req.params.playlist_id, req.body);

    return playlistController.deleteById(req.params.playlist_id)
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
  }

};

// getAll, create, getByIdParam, updateByIdParam, deleteByIdParam, addTrackByForeignId

export default new PlaylistRequestController();
