import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import {AuthService} from "./shared/service/auth.service";
import {Auth} from "./shared/model/auth";
import {AppState} from "../boot";
import {AuthState} from "./shared/model/state/auth.state";

@Injectable()
export class AuthGuard implements CanActivate {
  private auth:Observable<Auth>;

  constructor( private authService:AuthService, private store:Store<AppState>, private router:Router ) {

    this.auth = <Observable<Auth>>this.store.select('auth');

  }

  canActivate( next:ActivatedRouteSnapshot, state:RouterStateSnapshot ):boolean | Observable<boolean> {
    // console.log('AuthGuard.canActivate():', next.url);

    const result = new Subject<boolean>();
    let isInit = true;

    /**
     * Track whether
     * 1) the auth subscription was executed synchronously AND
     * 2) we need to immediately unsubscribe
     * @type {boolean}
     */
    let unsubscribeSync = false;

    const sub = this.auth
      .subscribe(( auth:Auth ) => {
        // console.log('AuthGuard.canActivate: subscribe():  isInit:', isInit, auth.state);

        if (auth.state === AuthState.LOGGED_IN) {
          // console.log('AuthGuard: LOGGED_IN!! NEXT:true', sub);

          console.warn('AuthGuard success: You are logged in and can continue...');

          if (sub) {
            sub.unsubscribe();
          } else {
            // This callback was executed synchronously and the subscription hasn't yet been assigned to the const
            // so unsubscribe later
            unsubscribeSync = true;
          }

          result.next(true);
          result.complete();
        } else if (auth.state === AuthState.LOGGED_OUT && isInit) {
          isInit = false;
          // console.log('AuthGuard: CALL LOAD!!');
          this.authService.load()
            .subscribe(null, ( error ) => {
              // console.log('AuthGuard: CATCH!! NEXT:false', sub);
              // Observable.throw(error);
              console.warn('AuthGuard denied: You are NOT logged in! Redirecting to sign-in...');
              sub.unsubscribe();

              result.next(false);
              result.complete();

              // TODO: How do we replace the current path in history?
              this.router.navigate(['/sign-in']);
            });
        }
      });

    if (unsubscribeSync && sub) {
      sub.unsubscribe();
    }


    return result;
  }
}
