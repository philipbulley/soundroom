import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Config } from "../model/config";
import { User } from "../model/user";
import { NetworkService } from "./network.service";
import { UserFactory } from "../model/factory/user.factory";
import { Auth } from "../model/auth";
import { AppState } from "../../boot";
import { LoadUserAction } from "../store/auth/load-user/load-user.action";
import { LoadUserSuccessAction } from "../store/auth/load-user-success/load-user-success.action";
import { LoadUserErrorAction } from "../store/auth/load-user-error/load-user-error.action";

@Injectable()
export class AuthService {

  private auth: Observable<Auth>;
  private isInit: boolean;

  constructor( private http: Http, private store: Store<AppState>, private networkService: NetworkService ) {

    // console.log('AuthService()');

  }

  load(): Observable<Response> {
    // console.log('AuthService.load()');

    if (!this.isInit) {
      this.init();
    }

    if (!this.jwt) {
      return Observable.throw(new Error('No cached JWT'));
    }

    this.store.dispatch(new LoadUserAction());

    const httpStream = this.http.get(Config.API_BASE_URL + '/me', this.networkService.requestOptions)
    // .delay(2000)    // DEBUG: Delay for simulation purposes only
      .map(( res: Response ) => UserFactory.createFromApiResponse(res.json()))
      .map(( user: User ) => {
        this.networkService.ok();

        // Assign initial data to collection
        this.store.dispatch(new LoadUserSuccessAction(user));
        return true;
      })
      .catch(( error: Response ) => {
        if (error.status === 401) {
          console.warn('401 Unauthorized!');
        } else {
          console.error(error);
        }
        this.store.dispatch(new LoadUserErrorAction({
          status: error.status,
          statusText: error.statusText,
        }));
        return Observable.throw(error || 'Server error');
      });

    return httpStream;
  }

  /**
   * Cache the JWT that has just been received after a login.
   *
   * @param jwt
   */
  set jwt( jwt: string ) {
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
