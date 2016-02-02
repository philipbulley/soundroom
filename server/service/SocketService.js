import { EventEmitter } from 'events';
import socketIO from 'socket.io';

class SocketService extends EventEmitter {

  constructor () {
    super();
  }

  init (server) {
    this.io = socketIO(server);
    this.io.on('connection', (socket) => {
      // console.log('--> new socket connection', socket);
      // TODO: send current state when user connects: current track, playing or paused
      // alternatively send with progress updates?
      const currentState = {};
      socket.emit('connect', currentState)
        .on('user:connect', (data) => {
          console.log(`user connect ${data}`);
        })
        .on('pause', () => this.emit('pause'))
        .on('resume', () => this.emit('resume'));
    });
  }

  /**
   * Notify new track started
   * @param track
   * @returns void
   */
  emitTrackStart (track) {
    this.io.emit('track:start', track);
  }

  /**
   * Update progress of current track
   * @param track
   * @returns void
   */
  emitTrackProgress (progress) {
    this.io.emit('track:progress', progress);
  }

  /**
   * End of playlist
   * @returns void
   */
  emitPlaylistEnd () {
    this.io.emit('playlist:end');
  }

  /**
   * Tell connected users about new user
   * @param user
   * @returns void
   */
  emitUserConnect (user) {
    this.io.emit('user:connect', user);
  }

  emitPause () {
    this.io.emit('pause');
  }

  emitResume () {
    this.io.emit('resume');
  }

  // emit new upvote
  emitUpVote (data) {
    this.io.emit('track:upvote', data);
  }

  // TODO:
  // new playlist order
  // new track added
  // user diconnect
  // track remove
}

export default new SocketService();
