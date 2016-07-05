import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import {AuthService} from "./service/auth.service";
import {Auth} from "./model/auth";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( /*private authService:AuthService,*/ private store:Store<Auth>, private router:Router ) {

    // TODO: Implement properly when we don't have an issue with injecting AuthService — currently this complains about it's http service dependency

  }

  canActivate( next:ActivatedRouteSnapshot, state:RouterStateSnapshot ):boolean | Observable<boolean> {
    // const auth = <Observable<Auth>>this.store.select('auth');

    // console.log('AuthGuard.canActivate:', auth);


    return true;
    // if (this.authService.isLoggedIn) {
    //   return true;
    // }

    // this.router.navigate(['/login']);
    // return false;
  }
}
