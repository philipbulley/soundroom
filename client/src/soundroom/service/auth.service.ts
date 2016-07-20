import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import {Config} from "../model/config";
import {User} from "../model/user";
import {AuthAction} from "../model/action/auth.action.ts";
import {NetworkService} from "./network.service";
import {UserFactory} from "../model/factory/user.factory";
import {Auth} from "../model/auth";
import {AppState} from "../../boot";

@Injectable()
export class AuthService {

  private auth:Observable<Auth>;
  private isInit:boolean;

  constructor( private http:Http, private store:Store<AppState>, private networkService:NetworkService ) {

    console.log('AuthService()');

  }

  load():Observable<Response> {
    console.log('AuthService.load()');

    if (!this.isInit) {
      this.init();
    }

    if (!this.jwt) {
      return Observable.throw(new Error('No cached JWT'));
    }

    this.store.dispatch({type: AuthAction.LOAD});

    const httpStream = this.http.get(Config.API_BASE_URL + '/me', this.networkService.requestOptions)
    // .delay(2000)    // DEBUG: Delay for simulation purposes only
      .map(( res:Response ) => {
        console.log('AuthService.load: res:', res);
        return res;
      })
      .map(( res:Response ) => UserFactory.createFromApiResponse(res.json()))
      .map(( user:User ) => {
        this.networkService.ok();

        // Assign initial data to collection
        console.log('AuthService.load: subscribe: user:', user);
        this.store.dispatch({type: AuthAction.POPULATE, payload: user});
        return true;
      })
      .catch(( error:Response ) => {
        if (error.status === 401) {
          console.warn('401 Unauthorized!');
        } else {
          console.error(error);
        }
        this.store.dispatch({type: AuthAction.POPULATE, payload: null});
        return Observable.throw(error || 'Server error');
      });

    // Make the request
    httpStream.subscribe((success:boolean) => {});

    return httpStream;
  }

  /**
   * Cache the JWT that has just been received after a login.
   *
   * @param jwt
   */
  set jwt( jwt:string ) {
    localStorage.setItem('jwt', jwt);
  }

  get jwt() {
    return localStorage.getItem('jwt');
  }


  /////////////////////////
  // PRIVATE METHODS
  /////////////////////////

  private init() {
    this.isInit = true;

    this.auth = <Observable<Auth>>this.store.select('auth');
  }

}
