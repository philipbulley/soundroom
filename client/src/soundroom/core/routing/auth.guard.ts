import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Auth } from '../../shared/model/auth';
import { AppState } from '../../shared/model/app-state';
import { AuthState } from '../../shared/model/state/auth.state';
import { LoadUserAction } from '../../shared/store/auth/load-user/load-user.action';

@Injectable()
export class AuthGuard implements CanActivate {
  private auth$: Observable<Auth>;

  constructor(private store$: Store<AppState>, private router: Router) {
    this.auth$ = this.store$.select((state: AppState) => state.auth);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    console.log('%cAuthGuard.canActivate(): ' + next.url, 'background-color:#f38e5e;color:#fff;padding:2px 20px;');

    const result$ = new Subject<boolean>();

    this.auth$
      .filter((auth: Auth) => auth.state === AuthState.LOGGED_OUT)
      .take(1)
      // LoadUserAction will redirect to sign-in if login results in error
      .subscribe(() => this.store$.dispatch(new LoadUserAction()));

    this.auth$
      .filter((auth: Auth) => auth.state === AuthState.LOGGED_IN)
      .take(1)
      .subscribe(() => {
        console.warn(`AuthGuard success: You are logged in and can continue to '${next.url}'...`);

        result$.next(true);
        result$.complete();
      });

    return result$;
  }
}
