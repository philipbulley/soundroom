import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions, Headers} from 'angular2/http';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';

import {Config} from "../model/config";
import {SocketEventTypeEnum} from "../model/enum/socket-event-type";
import {User} from "../model/user";
import {AuthAction} from "../model/enum/user-action";
import {NetworkService} from "./network.service";
import {UserFactory} from "../model/factory/user.factory";

@Injectable()
export class AuthService {

  private socket:SocketIOClient.Socket;

  constructor( private http:Http, private store:Store<User>, private networkService:NetworkService ) {

    console.log('AuthService()');

    this.socket = io(Config.SERVER_BASE_URL);
    this.socket.on(SocketEventTypeEnum.CONNECT, this.handleSocketConnect);

  }

  load() {

    console.log('AuthService.load()');

    this.store.dispatch({type: AuthAction.LOAD});

    this.http.get(Config.API_BASE_URL + '/me', this.networkService.requestOptions)
      .delay(2000)    // DEBUG: Delay for simulation purposes only
      .map(( res:Response ) => UserFactory.createFromApiResponse(res.json()))
      .subscribe(( user:User ) => {
        this.networkService.ok();

        // Assign initial data to collection
        console.log('AuthService.load: subscribe: user:', user);
        this.store.dispatch({type: AuthAction.POPULATE, payload: user});
      }, ( error:Response ) => {

        if (error.status === 401) {
          console.warn('401 Unauthorized!');
          this.store.dispatch({type: AuthAction.POPULATE, payload: null});
        } else {
        console.error(error);
          return Observable.throw(error || 'Server error');
        }
      });

  }

  /**
   * Cache the JWT that has just been received after a login.
   *
   * @param jwt
   */
  setJwt( jwt:string ) {
    localStorage.setItem('jwt', jwt);
  }


  private handleSocketConnect( data ) {
    console.log('AuthService.handleSocketConnect()', data);
  }

}
