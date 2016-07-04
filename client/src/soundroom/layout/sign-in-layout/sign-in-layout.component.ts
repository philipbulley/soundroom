import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {SocialSignInComponent} from "../../component/sign-in/social-sign-in.component";
import {Auth} from "../../model/auth";
import {AuthService} from "../../service/auth.service";
import {AppState} from "../../../boot";

@Component({
  selector: 'main-layout',
  template: require('./sign-in-layout.html'),
  styles: [require('./sign-in-layout.scss')],
  directives: [SocialSignInComponent, ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// @CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
//   // TODO: Wait for DI in Router hooks https://github.com/angular/angular/issues/7485 to be resolved (also wider conversation at https://github.com/angular/angular/issues/4112)
//   return true;
// })
export class SignInLayout implements OnInit {

  private auth:Observable<Auth>;

  constructor(private store:Store<AppState>, private route:ActivatedRoute, private router:Router, private authService:AuthService) {

    this.auth = <Observable<Auth>>store.select('auth');
    this.auth.subscribe((auth:Auth) => console.log('SignInLayout.auth: Auth:', auth));

  }

  ngOnInit():any {

    // Check whether we've been passed a new JWT via the query string

    // TODO: It should be possible to get jwt from ActivatedRoute.snapshot, but doesn't seem to work with @angular/router 3.0.0-beta.2 — for now we can subscribe to router Observable
    // let jwt = this.route.snapshot.params['jwt'];
    // console.log('SignInLayout.ngOnInit: jwt:', this.route.snapshot);

    this.router
      .routerState
      .queryParams
      .subscribe((params:any) => {

        if (params.jwt) {
          this.authService.jwt = params.jwt;
        }

        // TODO: Handle `error=denied` query string keypair?

        this.authService.load();
      });

  }


}
