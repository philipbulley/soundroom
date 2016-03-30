import {Injectable} from 'angular2/core';
import {SocketEventTypeEnum} from "../model/enum/socket-event-type";

import * as io from 'socket.io-client';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import {Config} from "../model/config";
import {Auth} from "../model/auth";
import {SocketEventTypeEnum} from "../model/enum/socket-event-type";
import {AuthState} from "../model/enum/auth-state";

@Injectable()
export class SocketService {
  private socket:SocketIOClient.Socket;
  private isInit:boolean;
  private auth$:Observable<Auth>;
  private auth:Auth;

  constructor( private store:Store<Auth> ) {

    console.log('SocketService()');

  }

  init() {
    this.isInit = true;

    this.auth$ = this.store.select('auth');
    this.auth$.subscribe(( auth ) => {

      console.log('SocketService.init: subscribe()', auth);

      this.auth = auth;

      if (auth && auth.state === AuthState.LOGGED_IN && !this.isConnected) {
        this.connect();
      }

    });
  }

  get isConnected() {
    return this.socket && this.socket.connected;
  }


  /////////////////////////
  // PRIVATE METHODS
  /////////////////////////

  private connect() {
    console.log('SocketService.connect()', this.auth.user._id);

    this.socket = io(Config.SERVER_BASE_URL);
    this.socket.on(SocketEventTypeEnum.CONNECT, ( data ) => this.handleSocketConnect(data));
  }

  private handleSocketConnect( data ) {
    console.log('SocketService.handleSocketConnect()', data, 'auth.user._id:', this.auth.user._id);

    this.socket.emit(SocketEventTypeEnum.USER_ENTER, this.auth.user._id);
  }

}
