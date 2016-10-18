import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SocialSignInComponent } from "../../component/sign-in/social-sign-in.component";
import { Auth } from "../../model/auth";
import { AuthService } from "../../service/auth.service";
import { AppState } from "../../../boot";
import { AuthState } from "../../model/state/auth.state";

@Component({
  selector: 'main-layout',
  template: require('./sign-in-layout.html'),
  styles: [require('./sign-in-layout.scss')],
  directives: [SocialSignInComponent, ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInLayout implements OnInit {

  private auth: Observable<Auth>;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private router: Router, private authService: AuthService) {

    this.auth = <Observable<Auth>>store.select('auth');

  }

  ngOnInit(): any {
    this.auth.subscribe((auth: Auth) => {
      console.log('SignInLayout.auth: Auth:', auth);

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
    // TODO: It should be possible to get jwt from ActivatedRoute.snapshot, but doesn't seem to work with
    // @angular/router 3.0.0-beta.2 — for now we can subscribe to router Observable let jwt =
    // this.route.snapshot.params['jwt']; console.log('SignInLayout.ngOnInit: jwt:', this.route.snapshot);

    this.router
      .routerState
      .queryParams
      .subscribe((params: any) => {

        if (params.jwt) {
          console.log('SignInLayout: FOUND JWT – attempt to auth...');
          this.authService.jwt = params.jwt;

          // TODO: Dispatch LoadUserAction here and run load() as an effect
          this.authService.load()
            .subscribe(() => {
              //
            });
        } else {
          console.log('SignInLayout: No JWT passed in, user to click a sign-in provider icon');
        }

        // TODO: Handle `error=denied` query string keypair?

      });
  }
}
