import {Injectable} from 'angular2/core';

import {Store} from '@ngrx/store';
import * as io from 'socket.io-client';

import {PlaylistCreate} from "../model/playlist-create";
import {Config} from "../model/config";
import {SocketEventTypeEnum} from "../model/enum/socket-event-type";
import {User} from "../model/user";

@Injectable()
export class UserService {
  private socket:SocketIOClient.Socket;

  constructor( public store:Store<User> ) {

    console.log('UserService()', io);

    // TODO: Error when using io() —> TypeError: Cannot read property 'zone' of undefined
    // this.socket = io(Config.SERVER_BASE_URL);
    // this.socket.on(SocketEventTypeEnum.CONNECT, this.handleSocketConnect);

  }

  isLoggedIn() {
    return true;
  }


  /////////////////////////
  // PRIVATE METHODS
  /////////////////////////

  private handleSocketConnect( data ) {
    console.log('UserService.handleSocketConnect()', data);
  }

}
