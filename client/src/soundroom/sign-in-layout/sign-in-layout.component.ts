import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/model/app-state';
import { AuthState } from '../shared/model/state/auth.state';
import { Auth } from '../shared/model/auth';
import 'rxjs/add/operator/first';
import { LoadUserAction } from '../shared/store/auth/load-user/load-user.action';

@Component({
  selector: 'sr-main-layout',
  template: require('./sign-in-layout.component.html'),
  styles: [require('./sign-in-layout.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInLayoutComponent implements OnInit {

  private auth$: Observable<Auth>;

  constructor(private store$: Store<AppState>, private activatedRoute: ActivatedRoute) {
    this.auth$ = this.store$.select((state: AppState) => state.auth);
  }

  ngOnInit(): any {
    this.auth$.subscribe((auth: Auth) => {
      console.log('SignInLayoutComponent.auth: Auth:', auth);

      switch (auth.state) {
        case AuthState.LOGGED_IN:
          // AuthGuard should never allow us to reach this. SignInLayout should only be accessible if
          // AuthState.LOGGED_OUT or AuthState.LOADING
          throw new Error('SignInLayout: LOGGED_IN: NOT ALLOWED!');

        case AuthState.LOGGED_OUT:
          this.checkJwt();
          break;
      }
    });
  }

  /**
   * Checks whether we've been passed a new JWT via the query string
   */
  checkJwt() {
    // Test OAuth redirect URL:
    // http://localhost:8080/sign-in?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NmY1NDkxNDE0YmE1YjI1OWY4M2NkMjMiLCJleHAiOjE1MTA0MTg0NzF9.6Jfb51IvZxkjKg0DZICAEFoUGfIHtMMEc-CNAci7ISM

    this.activatedRoute
      .queryParams
      .first()
      .subscribe((params: any) => {
        console.log('SignInLayoutComponent.checkJwt(): subscribe: params:', params);

        if (params.jwt) {
          console.log('SignInLayout: FOUND JWT IN URL – attempt to auth...');

          this.store$.dispatch(new LoadUserAction({jwt: params.jwt}));
        } else {
          console.log('SignInLayout: No JWT passed in, user to click a sign-in provider icon');
        }

        // TODO: Handle `error=denied` query string keypair?

      });
  }
}
