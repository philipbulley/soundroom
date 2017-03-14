import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import 'rxjs/add/operator/filter';
import { LoadUserAction } from './load-user/load-user.action';
import { NetworkService } from '../../service/network.service';
import { Observable } from 'rxjs';
import { Config } from '../../model/config';
import { UserFactory } from '../../model/factory/user.factory';
import { User } from '../../model/user';
import { LoadUserSuccessAction } from './load-user-success/load-user-success.action';
import { LoadUserErrorAction } from './load-user-error/load-user-error.action';
import { LoadUserParams } from './load-user/load-user-params';
import { LoadUserErrorResult } from './load-user-error/load-user-error-result';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions, private http: Http, private networkService: NetworkService, private router: Router) {
    //
  }

  @Effect()
  loadUser(): Observable<LoadUserSuccessAction | LoadUserErrorAction> {
    return this.actions$
      .filter((action: Action) => action instanceof LoadUserAction)
      .do((action: LoadUserAction) => {
        if (action.payload && action.payload.jwt) {
          // Persist the JWT
          this.networkService.jwt = action.payload.jwt;
        }
      })
      .switchMap((action: LoadUserAction) => {
        return this.makeLoginRequest(action.payload)
          .map((user: User) => new LoadUserSuccessAction(user))
          .catch((loadUserError: LoadUserError) => Observable.of(new LoadUserErrorAction({
            skipSignInRedirect: loadUserError.params
              ? loadUserError.params.skipSignInRedirectOnError
              : false,
            status: loadUserError.error instanceof Response
              ? (loadUserError.error as Response).status
              : 0,
            statusText: loadUserError.error instanceof Response
              ? (loadUserError.error as Response).statusText
              : (loadUserError.error as Error).message,
          })));
      });
  }

  @Effect({
    dispatch: false,
  })
  loadUserError() {
    return this.actions$
      .filter((action: Action) => action instanceof LoadUserErrorAction)
      .map((action: LoadUserErrorAction) => action.payload)
      .do((payload: LoadUserErrorResult) => payload.skipSignInRedirect
      || this.router.navigate(['/sign-in'], {replaceUrl: true}))
      .ignoreElements();
  }

  // TODO: Add effect LoadUserSuccessAction

  private makeLoginRequest(params: LoadUserParams): Observable<User> {
    console.log('AuthEffects.makeLoginRequest(): params', params);

    if (!this.networkService.jwt) {
      const error: LoadUserError = {
        params: params,
        error: new Error('No cached JWT'),
      };
      return Observable.throw(error);
    }

    return this.http.get(Config.API_BASE_URL + '/me', this.networkService.requestOptions)
    // .delay(2000)    // DEBUG: Delay for simulation purposes only
      .map((res: Response) => UserFactory.createFromApiResponse(res.json()))
      .do(() => this.networkService.ok())
      .catch((res: Response) => {
        const error: LoadUserError = {
          params: params,
          error: res,
        };
        return Observable.throw(error);
      });
  }
}

interface LoadUserError {
  params: LoadUserParams;
  error: Response | Error;
}
