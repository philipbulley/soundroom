import { EventEmitter } from 'events';
import socketIO from 'socket.io';
import _ from 'lodash';

class SocketService extends EventEmitter {

  constructor () {
    super();
  }

  init (server) {
    this.users = {};
    this.io = socketIO(server);
    this.io.on('connection', (socket) => {
      // console.log('--> new socket connection', socket);
      // TODO: send current state when user connects: current track, playing or paused
      // alternatively send with progress updates?
      const currentState = {};
      socket.emit('connect', currentState)
        .on('client:connect', (userId) => {
          this.users[socket.client.id] = userId;
          console.log(`client connect`, socket.client.id);
          // console.log(`user connect ${data}`);
          console.log('connections:', Object.keys(this.io.engine.clients));
          this.emit('client:connect', userId);

        })
        .on('client:pause', () => this.emit('pause'))
        .on('client:resume', () => this.emit('resume'))
        .on('disconnect', () => {
          console.log('user disconnected');
          const userId = this.users[socket.client.id];
          delete this.users[socket.client.id];
          console.log('connections:', Object.keys(this.io.engine.clients));
          console.log('users:', Object.keys(this.users));
          this.emit('client:disconnect', userId);
        });
    });

    // const allClients = [];
    // io.sockets.on('connection', function(socket) {
    //   allClients.push(socket);
    //
    //   socket.on('disconnect', function() {
    //     console.log('Got disconnect!');
    //
    //     var i = allClients.indexOf(socket);
    //     allClients.splice(i, 1);
    //   });
    // });
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
  userConnected (user, users) {
    this.io.emit('user:connect', user, users);
  }

  updateConnectedUsers (users) {
    const ids = Object.keys(this.users).map((id) => this.users[id]);
    const connectedUsers = users.filter((user) => ids.indexOf(user.id) > -1);
    this.io.emit('user:connect', connectedUsers);
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
