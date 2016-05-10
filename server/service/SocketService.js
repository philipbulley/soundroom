import {EventEmitter} from 'events';
import socketIO from 'socket.io';
import EventTypeEnum from '../model/enum/EventTypeEnum';
import socketUsers from '../model/state/SocketUsers';

class SocketService extends EventEmitter {

  constructor() {
    super();
  }

  init(server) {
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
  emitTrackStart(payload) {
    this.io.emit(EventTypeEnum.PLAYLIST_TRACK_START, payload);
  }

  /**
   * Update progress of current track
   * @param payload
   * @returns void
   */
  emitTrackProgress(payload) {
    this.io.emit(EventTypeEnum.PLAYLIST_TRACK_PROGRESS, payload);
  }

  /**
   * End of playlist
   * @param playlistId
   * @returns void
   */
  emitPlaylistEnd(playlistId) {
    this.io.emit(EventTypeEnum.PLAYLIST_END, playlistId);
  }

  updateConnectedUsers(users) {
    console.log(users.map((user) => user.id).join(','));
    const connectedUsers = users.filter((user) => socketUsers.contains(user.id));
    console.log('connectedUsers', connectedUsers.length);
    this.io.emit(EventTypeEnum.USER_UPDATE, connectedUsers);
  }

  emitPause(payload) {
    this.io.emit(EventTypeEnum.PLAYLIST_PAUSE, payload);
  }

  emitPlay(payload) {
    this.io.emit(EventTypeEnum.PLAYLIST_PLAY, payload);
  }

  /**
   * This should be handled by emitting change events along with playlistTrack ordering
   *
   * @deprecated
   * @param track
   */
  emitUpVote(track) {
    this.io.emit(EventTypeEnum.PLAYLIST_TRACK_UPVOTE, track);
  }

  /**
   *
   * @param {string} action                 A string describing reason for update. Use property within `PlaylistTracksChangeActionEnum`
   * @param {PlaylistTrack} playlistTrack   The PlaylistTrack the action has been performed upon
   * @param {string[]} playlistTrackIds     Array of IDs in the correctly sorted order
   */
  emitTracksChange(action, playlistTrack, playlistTrackIds) {
    this.io.emit(EventTypeEnum.PLAYLIST_TRACKS_CHANGE, {action, playlistTrack, playlistTrackIds});
  }

  // TODO:
  // new playlist order
  // new track added
  // user diconnect
  // track remove
}

export default new SocketService();
