import {Component, ChangeDetectionStrategy, OnInit} from 'angular2/core';
import {CanActivate, ComponentInstruction, RouteParams, RouterLink} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {SocialSignInComponent} from "../../component/sign-in/social-sign-in.component";
import {Auth} from "../../model/auth";
import {AuthService} from "../../service/auth.service";


@Component({
  selector: 'main-layout',
  template: require('./sign-in-layout.html'),
  styles: [require('./sign-in-layout.scss')],
  directives: [SocialSignInComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// @CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
//   // TODO: Wait for DI in Router hooks https://github.com/angular/angular/issues/7485 to be resolved (also wider conversation at https://github.com/angular/angular/issues/4112)
//   return true;
// })
export class SignInLayout implements OnInit {

  private auth:Observable<Auth>;

  constructor( private store:Store<Auth>, private routeParams:RouteParams, private authService:AuthService ) {

    this.auth = store.select('auth');
    this.auth.subscribe(( auth:Auth ) => console.log('SignInLayout.auth: Auth:', auth));

  }

  ngOnInit():any {

    // Check whether we've been passed a new JWT via the query string
    let jwt = this.routeParams.get('jwt');

    if (jwt) {
      this.authService.setJwt(jwt);
    }

    // TODO: Handle `error=denied` query string keypair?

    this.authService.load();

  }


}
