// import _ from 'lodash';
import {play, pause} from './PlaybackController';
import socketService from '../service/SocketService';

const initSocket = (server) => {
  socketService.init(server);

  socketService
    .on('play', play)
    .on('pause', pause);
};

// TODO: handle upvote etc

export {initSocket};
