import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import {Config} from "../model/config";
import {User} from "../model/user";
import {AuthAction} from "../model/action/auth.action.ts";
import {NetworkService} from "./network.service";
import {UserFactory} from "../model/factory/user.factory";
import {Auth} from "../model/auth";

@Injectable()
export class AuthService {

  private auth$:Observable<Auth>;
  private auth:Auth;
  private isInit:boolean;

  constructor( private http:Http, private store:Store<Auth>, private networkService:NetworkService ) {

    console.log('AuthService()');

  }

  load() {

    if (!this.isInit) {
      this.init();
    }

    console.log('AuthService.load()');

    this.store.dispatch({type: AuthAction.LOAD});

    this.http.get(Config.API_BASE_URL + '/me', this.networkService.requestOptions)
      // .delay(2000)    // DEBUG: Delay for simulation purposes only
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

    this.auth$ = this.store.select('auth');
    this.auth$.subscribe(( auth ) => this.auth = auth);
  }

}
