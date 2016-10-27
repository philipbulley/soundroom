import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Auth } from '../../shared/model/auth';
import { AuthService } from '../../shared/service/auth.service';
import { AppState } from '../../shared/model/app-state';
import { AuthState } from '../../shared/model/state/auth.state';

@Injectable()
export class NoAuthGuard implements CanActivate {
  private auth: Observable<Auth>;

  constructor(private authService: AuthService, private store: Store<AppState>, private router: Router) {

    this.auth = <Observable<Auth>>this.store.select('auth');

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    console.log('NoAuthGuard.canActivate():', next.url);

    const result = new Subject<boolean>();
    let isInit = true;
    let unsubscribeSync = false;

    const sub = this.auth
      .subscribe((auth: Auth) => {
        // console.log('NoAuthGuard.canActivate: subscribe():', isInit, auth.state);

        if (auth.state === AuthState.LOGGED_IN) {
          // console.log('NoAuthGuard: LOGGED_IN!! NEXT:false');

          console.warn('NoAuthGuard denied: You are logged in! Redirecting to a permitted logged in route...');

          if (sub) {
            sub.unsubscribe();
          } else {
            // This callback was executed synchronously and the subscription hasn't yet been assigned to the const
            // so unsubscribe later
            unsubscribeSync = true;
          }

          result.next(false);
          result.complete();

          // TODO: How do we replace the current path in history?
          this.router.navigate(['/rooms']);
        } else if (auth.state === AuthState.LOGGED_OUT && isInit) {
          isInit = false;
          // console.log('NoAuthGuard: CALL LOAD!!');
          this.authService.load()
            .subscribe(null, (error) => {
              // console.log('NoAuthGuard: CATCH!! NEXT:true', error);
              console.warn('NoAuthGuard success: You are NOT logged in and can continue...');
              // Observable.throw(error);

              sub.unsubscribe();
              result.next(true);
              result.complete();
            });
        }
      });

    if (unsubscribeSync && sub) {
      sub.unsubscribe();
    }

    return result;
  }
}
