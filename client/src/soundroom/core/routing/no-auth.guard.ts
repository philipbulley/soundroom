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
  private auth$: Observable<Auth>;

  constructor(private authService: AuthService, private store$: Store<AppState>, private router: Router) {

    this.auth$ = this.store$.map((state: AppState) => state.auth);

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    // console.log('NoAuthGuard.canActivate():', next.url);

    const result$ = new Subject<boolean>();

    this.auth$
      .filter((auth: Auth) => auth.state === AuthState.LOGGED_IN)
      .take(1)
      .subscribe(() => {
        result$.next(false);
        result$.complete();

        console.warn('NoAuthGuard denied: You are logged in! Redirect...');

        this.router.navigate(['/rooms'], {replaceUrl: true});
      });

    this.auth$
      .filter((auth: Auth) => auth.state === AuthState.LOGGED_OUT)
      .take(1)
      .mergeMap((auth: Auth) => this.authService.load())
      .subscribe(() => {
        // Do nothing as AuthState.LOGGED_IN observable will receive event
      }, (error) => {
        // console.log('AuthGuard: CATCH!! NEXT:false', sub);
        console.warn('NoAuthGuard success: You are NOT logged in! Continue...');

        result$.next(true);
        result$.complete();
      });

    return result$;
  }
}
