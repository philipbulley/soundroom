import {Injectable} from '@angular/core';

import * as io from 'socket.io-client';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import {Config} from "../model/config";
import {Auth} from "../model/auth";
import {SocketEventTypeEnum} from "../model/socket/socket-event-type.enum.ts";
import {AuthState} from "../model/state/auth.state.ts";
import {AppState} from "../../boot";

@Injectable()
export class SocketService {
  stream$:Observable<any>;

  private socket:SocketIOClient.Socket;
  private isInit:boolean;
  private auth:Observable<Auth>;

  private serverToClient:any = [
    SocketEventTypeEnum.PLAYLIST_PLAY,
    SocketEventTypeEnum.PLAYLIST_PAUSE,
    SocketEventTypeEnum.PLAYLIST_TRACK_START,
    SocketEventTypeEnum.PLAYLIST_TRACK_PROGRESS,
    SocketEventTypeEnum.PLAYLIST_END,
    SocketEventTypeEnum.USER_UPDATE,
    SocketEventTypeEnum.PLAYLIST_TRACK_UPVOTE,
    SocketEventTypeEnum.PLAYLIST_TRACK_VETO,
    SocketEventTypeEnum.PLAYLIST_TRACKS_CHANGE
  ];
  private streamObserver:Observer<any>;

  constructor( private store:Store<AppState> ) {

    console.log('SocketService()');

  }

  init() {
    this.isInit = true;

    this.stream$ = new Observable(observer => this.streamObserver = observer);

    this.auth = <Observable<Auth>>this.store.select('auth');
    this.auth.subscribe( auth => {

      console.log('SocketService.init: subscribe()', auth);

      if (auth && auth.state === AuthState.LOGGED_IN && !this.isConnected) {
        this.connect();
      }

    });
  }

  emit( event:SocketEventTypeEnum, value:any ) {
    this.ensureConnected();

    this.socket.emit(<string>event, value);
  }

  get isConnected() {
    return this.socket && this.socket.connected;
  }


  /////////////////////////
  // PRIVATE METHODS
  /////////////////////////

  private connect() {
    this.socket = io(Config.SERVER_BASE_URL);
    this.socket.on(SocketEventTypeEnum.CONNECT, data => {
      this.socket.on(SocketEventTypeEnum.AUTHENTICATED, () => {
        console.log('SocketService: AUTHENTICATED');
        this.serverToClient.forEach(eventType => {
          // console.log('call socket.on', eventType);

          this.socket.on(eventType, data => {
            // console.log('socket.on():', eventType, data, this.streamObserver);
            if (this.streamObserver) {
              // TODO: Create a type for this event object
              this.streamObserver.next({type: eventType, data: data});
            }
          });
        });
      });

      this.socket.emit( SocketEventTypeEnum.AUTHENTICATE, {jwt: localStorage.getItem('jwt')} )
    });
  }

  private ensureConnected() {
    if (!this.isConnected) {
      throw new Error('Please ensure socket is connected before using it.');
    }
  }

}
