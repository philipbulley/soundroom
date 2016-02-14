// import _ from 'lodash';
import {play, pause} from './PlaybackController';
import playlistController from './PlaylistController';
import {updateUserList} from './UserController';
import socketService from '../service/SocketService';
import EventTypeEnum from '../model/enum/EventTypeEnum';
import log from './../util/LogUtil';


const upVote = (client, playlistId, trackId) => {
  return playlistController.upVoteTrack(playlistId, trackId)
    .then((track) => {
      socketService.emitUpVote(track);
    })
    .catch((err) => {
      client.emit(EventTypeEnum.ERROR_PLAYLIST_TRACK_UPVOTE, err.message, playlistId, trackId);
      // HttpUtil.sendJsonError(res, HttpUtil.status.INTERNAL_SERVER_ERROR);
      log.formatError(err, 'PlaylistRequestController.upVoteTrack');
      // socketService.emitUpVoteError(track);
    });
};

const veto = (client, playlistId, trackId) => {
  console.log('TODO: implement veto', playlistId, trackId);
  client.emit(EventTypeEnum.ERROR_PLAYLIST_TRACK_VETO, new Error('Not implemented').message, playlistId, trackId);
};

const initSocket = (server) => {
  socketService.init(server);

  socketService
    .on(EventTypeEnum.PLAYLIST_PLAY, play)
    .on(EventTypeEnum.PLAYLIST_PAUSE, pause)
    .on(EventTypeEnum.PLAYLIST_TRACK_UPVOTE, upVote)
    .on(EventTypeEnum.PLAYLIST_TRACK_VETO, veto)
    .on(EventTypeEnum.USER_UPDATE, updateUserList);
};

export {initSocket};
