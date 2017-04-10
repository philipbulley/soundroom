import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Config } from '../../shared/model/config';
import { Auth } from '../../shared/model/auth';
import { SocketEventTypeEnum } from '../../shared/model/socket/socket-event-type.enum.ts';
import { AuthState } from '../../shared/model/state/auth.state.ts';
import { AppState } from '../model/app-state';

@Injectable()
export class SocketService {
  stream$: Observable<any>;

  private socket: SocketIOClient.Socket;
  private isInit: boolean;
  private auth$: Observable<Auth>;

  private serverToClient: SocketEventTypeEnum[] = [
    SocketEventTypeEnum.PLAYLIST_PLAY,
    SocketEventTypeEnum.PLAYLIST_PAUSE,
    SocketEventTypeEnum.PLAYLIST_TRACK_START,
    SocketEventTypeEnum.PLAYLIST_TRACK_PROGRESS,
    SocketEventTypeEnum.PLAYLIST_END,
    SocketEventTypeEnum.USER_UPDATE,
    SocketEventTypeEnum.PLAYLIST_TRACK_UP_VOTE,
    SocketEventTypeEnum.PLAYLIST_TRACK_VETO,
    SocketEventTypeEnum.PLAYLIST_TRACKS_CHANGE,
  ];
  private streamObserver: Observer<any>;
  private isConnecting: boolean;

  constructor(private store$: Store<AppState>) {
    // console.log('SocketService()');
    this.init();
  }

  init() {
    this.isInit = true;

    this.stream$ = new Observable(observer => this.streamObserver = observer);

    this.auth$ = this.store$.select((state: AppState) => state.auth);
    this.auth$
      .filter((auth: Auth) => auth && auth.state === AuthState.LOGGED_IN && !this.isConnected && !this.isConnecting)
      .subscribe(auth => this.connect());
  }

  emit(event: SocketEventTypeEnum, value: any) {
    // console.log('SocketService.emit():', event, value);
    this.ensureConnected();

    this.socket.emit(<string>event, value);
  }

  get isConnected() {
    return this.socket && this.socket.connected;
  }

  /////////////////////////
  // PRIVATE METHODS
  /////////////////////////

  /**
   * Start the process of connecting to the server via socket connection
   */
  private connect() {
    // console.log('SocketService.connect()');

    // TODO: Handle connection errors?
    this.isConnecting = true;
    this.socket = io(Config.SERVER_BASE_URL);

    // Wait for socket connection to be made...
    this.socket.on(SocketEventTypeEnum.CONNECT, data => this.handleSocketConnect(data));
  }

  /**
   * Invoked once the socket connection has been established
   */
  private handleSocketConnect(data: any) {
    // Wait for user to be authenticated over socket connection...
    this.socket.on(SocketEventTypeEnum.AUTHENTICATED, () => this.handleSocketAuthenticated());

    // TODO: Replace with selector
    this.store$
      .select((store: AppState) => store.auth.jwt)
      .take(1)
      .subscribe(jwt => this.socket.emit(SocketEventTypeEnum.AUTHENTICATE, {jwt: jwt}));
  }

  /**
   * Invoked once the user has been authenticated on the socket connection
   */
  private handleSocketAuthenticated() {
    this.isConnecting = false;

    // Register handler for each server -> client event
    this.serverToClient.forEach(eventType =>
      this.socket.on(eventType.toString(), data => this.handleSocketEvent(eventType, data))
    );
  }

  /**
   * Invoked when receiving an event from the server
   */
  private handleSocketEvent(type: SocketEventTypeEnum, data: any) {
    // console.log('SocketService: socket.on():', eventType, data, this.streamObserver);
    if (this.streamObserver) {
      // TODO: Create a type for this event object
      this.streamObserver.next({type, data});
    }
  }

  private ensureConnected() {
    if (!this.isConnected) {
      throw new Error('Please ensure socket is connected before using it.');
    }
  }
}
