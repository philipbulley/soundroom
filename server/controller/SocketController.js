// import _ from 'lodash';
import {play, pause} from './PlaybackController';
import playlistController from './PlaylistController';
import {updateUserList} from './UserController';
import socketService from '../service/SocketService';
import EventTypeEnum from '../model/enum/EventTypeEnum';
import log from './../util/LogUtil';


const upVote = (client, payload) => {
  // console.log('SocketController.upVote: payload:', payload, 'userId:', client.userId);

  const {playlistId} = payload;
  const {trackId} = payload;
  const {playlistTrackId} = payload;

  return playlistController.upVoteTrack(client.user, playlistId, playlistTrackId || trackId)
    .catch((err) => {
      client.emit(EventTypeEnum.ERROR_PLAYLIST_TRACK_UP_VOTE, err.message, playlistId, trackId);
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
    .on(EventTypeEnum.PLAYLIST_TRACK_UP_VOTE, upVote)
    .on(EventTypeEnum.PLAYLIST_TRACK_VETO, veto)
    .on(EventTypeEnum.USER_UPDATE, updateUserList);
};

export {initSocket};
