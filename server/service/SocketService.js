import {EventEmitter} from 'events';
import socketIO from 'socket.io';
import EventTypeEnum from '../model/enum/EventTypeEnum';
import socketUsers from '../model/state/SocketUsers';

const jwt = require('jsonwebtoken');

class SocketService extends EventEmitter {

  constructor() {
    super();
  }

  init(server) {
    this.io = socketIO(server);
    this.io.on(EventTypeEnum.CONNECTION, socket => {
      // console.log('SocketService.init: CONNECTION');

      // Temporarily delete socket from namespace connected map
      delete this.io.sockets.connected[socket.id];

      const options = {
        secret: process.env.JWT_TOKEN_SECRET,
        timeout: 5000 // 5 seconds to send the authentication message
      };

      const authTimeout = setTimeout(() => socket.disconnect('unauthorized'), options.timeout || 5000);

      var handleAuthenticate = data => {
        clearTimeout(authTimeout);
        // console.log('SocketService.init: handleAuthenticate():', data.jwt);

        jwt.verify(data.jwt, options.secret, options, (err, decoded) => {
          // console.log('SocketService.init: handleAuthenticate: jwt.verify(): decoded:', decoded);
          if (err) {
            socket.disconnect('unauthorized');
            return;
          }

          if (decoded) {
            // Restore temporarily disabled connection
            this.io.sockets.connected[socket.id] = socket;

            // Store the user ID on the socket for easy retrieval within subsequent socket event handlers
            socket.userId = decoded.iss;
            socket.expiresAt = new Date(decoded.exp * 1000);
            socket.connectedAt = new Date();

            console.log('SocketService.init: Auth Success:\n\tuserId:', socket.userId,
              '\n\texpiresAt:', socket.expiresAt,
              '\n\tconnectedAt:', socket.connectedAt,
              '\n\tsocket.client.id:', socket.client.id
            );

            this.initListeners(socket);

            socket.emit(EventTypeEnum.AUTHENTICATED);

            // Add to global user list and inform clients
            socketUsers.add(socket.client.id, socket.userId);
            this.emit(EventTypeEnum.USER_UPDATE);
          }
        })
      };

      socket.on(EventTypeEnum.AUTHENTICATE, handleAuthenticate);
    });
  }

  /**
   * Once user is connected and authenticated, we can attach app listeners
   * @param socket
   */
  initListeners(socket) {
    const currentState = {};
    socket.emit(EventTypeEnum.CONNECT, currentState)
      .on(EventTypeEnum.PLAYLIST_PLAY, id => this.emit(EventTypeEnum.PLAYLIST_PLAY, id))
      .on(EventTypeEnum.PLAYLIST_PAUSE, id => this.emit(EventTypeEnum.PLAYLIST_PAUSE, id))
      .on(EventTypeEnum.PLAYLIST_TRACK_UPVOTE, (playlistId, trackId) => this.emit(EventTypeEnum.PLAYLIST_TRACK_UPVOTE, socket, playlistId, trackId))
      .on(EventTypeEnum.PLAYLIST_TRACK_VETO, (playlistId, trackId) => this.emit(EventTypeEnum.PLAYLIST_TRACK_VETO, socket, playlistId, trackId))
      .on(EventTypeEnum.DISCONNECT, () => {
        socket.removeAllListeners();
        socketUsers.remove(socket.client.id);
        this.emit(EventTypeEnum.USER_UPDATE);
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

  updateConnectedUsers(users) {
    console.log('SocketService.updateConnectedUsers(): users:', users.map(user => user.id).join(', '));

    const connectedUsers = users.filter(user => socketUsers.contains(user.id));
    console.log('SocketService.updateConnectedUsers:', connectedUsers.length);
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
   * @param {string} playlistId             The ID of the affected playlist
   * @param {PlaylistTrack} playlistTrack   The PlaylistTrack the action has been performed upon
   * @param {string[]} playlistTrackIds     Array of PlaylistTrack IDs in the correctly sorted order
   */
  emitTracksChange(action, playlistId, playlistTrack, playlistTrackIds) {
    this.io.emit(EventTypeEnum.PLAYLIST_TRACKS_CHANGE, {action, playlistId, playlistTrack, playlistTrackIds});
  }

  // TODO:
  // new playlist order
  // new track added
  // user diconnect
  // track remove
}

export default new SocketService();
