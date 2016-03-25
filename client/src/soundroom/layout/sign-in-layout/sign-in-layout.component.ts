import {Component, ChangeDetectionStrategy} from 'angular2/core';
import {CanActivate, ComponentInstruction} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {User} from "../../model/user";
import {SocialSignInComponent} from "../../component/sign-in/social-sign-in.component";
import {UserService} from "../../service/user.service";


@Component({
  selector: 'main-layout',
  template: require('./sign-in-layout.html'),
  styles: [require('./sign-in-layout.scss')],
  directives: [SocialSignInComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// @CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
//   // TODO: Wait for DI in Router hooks https://github.com/angular/angular/issues/7485 to be resolved (also wider conversation at https://github.com/angular/angular/issues/4112)
//   return true;
// })
export class SignInLayout {

  constructor( private store:Store<User>, private userService:UserService ) {

  }

}
