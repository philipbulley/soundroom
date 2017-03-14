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
export class NoAuthGuard implements CanActivate {
  private auth$: Observable<Auth>;

  constructor(private store$: Store<AppState>, private router: Router) {
    this.auth$ = this.store$.map((state: AppState) => state.auth);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    console.log('%cNoAuthGuard.canActivate(): ' + next.url, 'background-color:#f38e5e;color:#333;padding:2px 20px;');

    const result$ = new Subject<boolean>();

    this.auth$
      .filter((auth: Auth) => auth.state === AuthState.LOGGED_IN)
      .take(1)
      .subscribe(() => {
        result$.next(false);
        result$.complete();

        console.warn('NoAuthGuard denied: You are logged in! Redirect to an authenticated page...');

        this.router.navigate(['/rooms'], {replaceUrl: true});
      });

    this.auth$
      .filter((auth: Auth) => auth.state === AuthState.LOGGED_OUT)
      .take(2)
      .subscribe((auth: Auth) => {
        if (!auth.error) {
          // We haven't yet attempted to load the user as there is no auth.error
          this.store$.dispatch(new LoadUserAction({skipSignInRedirectOnError: true}));
          // The take(2) above will allow us to respond if there's an error
        } else {
          // We have a previous error, allow user to proceed to sign-in
          console.warn(`NoAuthGuard success: You are NOT logged in! Continue to '${next.url}'...`);
          result$.next(true);
          result$.complete();
        }
      });

    return result$;
  }
}
