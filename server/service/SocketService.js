import {EventEmitter} from 'events';
import socketIO from 'socket.io';
import EventTypeEnum from '../model/enum/EventTypeEnum';
import socketUsers from '../model/state/SocketUsers';

class SocketService extends EventEmitter {

  constructor () {
    super();
  }

  init (server) {
    this.io = socketIO(server);
    this.io.on(EventTypeEnum.CONNECTION, (socket) => {
      // console.log('--> new socket connection', socket);
      // TODO: send current state when user connects: current track, playing or paused
      // alternatively send with progress updates?
      const currentState = {};
      socket.emit(EventTypeEnum.CONNECT, currentState)
        .on(EventTypeEnum.USER_ENTER, (userId) => {
          socketUsers.add(socket.client.id, userId);
          this.emit(EventTypeEnum.USER_UPDATE);
        })
        .on(EventTypeEnum.PLAYLIST_PLAY, (id) => (
          this.emit(EventTypeEnum.PLAYLIST_PLAY, id)
        ))
        .on(EventTypeEnum.PLAYLIST_PAUSE, (id) => (
          this.emit(EventTypeEnum.PLAYLIST_PAUSE, id)
        ))
        .on(EventTypeEnum.PLAYLIST_TRACK_UPVOTE, (playlistId, trackId) => (
          this.emit(EventTypeEnum.PLAYLIST_TRACK_UPVOTE, socket, playlistId, trackId)
        ))
        .on(EventTypeEnum.PLAYLIST_TRACK_VETO, (playlistId, trackId) => (
          this.emit(EventTypeEnum.PLAYLIST_TRACK_VETO, socket, playlistId, trackId)
        ))
        .on(EventTypeEnum.DISCONNECT, () => {
          socket.removeAllListeners();
          socketUsers.remove(socket.client.id);
          this.emit(EventTypeEnum.USER_UPDATE);
        });
    });
  }

  /**
   * Notify new track started
   * @param track
   * @returns void
   */
  emitTrackStart (track) {
    this.io.emit(EventTypeEnum.PLAYLIST_TRACK_START, track);
  }

  /**
   * Update progress of current track
   * @param track
   * @param progress
   * @returns void
   */
  emitTrackProgress (track, progress) {
    this.io.emit(EventTypeEnum.PLAYLIST_TRACK_PROGRESS, track, progress);
  }

  /**
   * End of playlist
   * @param playlistId
   * @returns void
   */
  emitPlaylistEnd (playlistId) {
    this.io.emit(EventTypeEnum.PLAYLIST_END, playlistId);
  }

  updateConnectedUsers (users) {
    console.log(users.map((user) => user.id).join(','));
    const connectedUsers = users.filter((user) => socketUsers.contains(user.id));
    console.log('connectedUsers', connectedUsers.length);
    this.io.emit(EventTypeEnum.USER_UPDATE, connectedUsers);
  }

  emitPause () {
    this.io.emit(EventTypeEnum.PLAYLIST_PAUSE);
  }

  emitPlay () {
    this.io.emit(EventTypeEnum.PLAYLIST_PLAY);
  }

  emitUpVote (track) {
    this.io.emit(EventTypeEnum.PLAYLIST_TRACK_UPVOTE, track);
  }

  // TODO:
  // new playlist order
  // new track added
  // user diconnect
  // track remove
}

export default new SocketService();
