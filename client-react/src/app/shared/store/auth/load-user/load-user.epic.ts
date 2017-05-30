import { LOAD_USER, LoadUserAction, LoadUserParams } from './load-user.action';
import loadUserSuccessAction from '../load-user-success/load-user-success.action';
import loadUserErrorAction from '../load-user-error/load-user-error.action';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { User } from '../../../user/user';
import { Config } from '../../../model/config';
import { StoreState } from '../../store-state';
import { createUserFromApiResponse } from '../../../user/user.factory';
import { AjaxCreationMethod, AjaxError } from 'rxjs/observable/dom/AjaxObservable';
import { createHeaders } from '../../../network-helper';
import { AuthActions } from '../auth.reducer';
import { Epic } from 'redux-observable';
import { Auth } from '../auth';

// TODO(redux-observable): Inject dependency when fixed: https://github.com/redux-observable/redux-observable/issues/231
import { ajax } from 'rxjs/observable/dom/ajax';

const JWT_STORAGE_KEY: string = 'soundroom.auth.jwt';

export const loadUserEpic: Epic<AuthActions, StoreState> = (action$, store/*, {ajax}*/) => action$
  .filter(action => action.type === LOAD_USER)
  .do((action: LoadUserAction) => {
    if (action.payload.jwt) {
      // Persist the JWT
      localStorage.setItem(JWT_STORAGE_KEY, action.payload.jwt);
    }
  })
  .switchMap((action: LoadUserAction) => {
    return makeLoginRequest(store.getState().auth, ajax, action.payload)
      .map((user: User) => loadUserSuccessAction(user))
      .catch((loadUserError: LoadUserError) => Observable.of(loadUserErrorAction({
        type: null, // TODO: Define error types for this kind of error?
        skipSignInRedirect: !!(loadUserError.params && loadUserError.params.skipSignInRedirectOnError),
        status: loadUserError.error instanceof AjaxError
          ? loadUserError.error.status
          : 0,
        message: loadUserError.error.message || 'unable to load user',
      })));
  });

function makeLoginRequest(
  auth: Auth, ajax: AjaxCreationMethod, params: LoadUserParams): Observable<User> {

  if (!auth.jwt) {
    const error: LoadUserError = {
      params,
      error: new Error('No cached JWT'),
    };
    return Observable.throw(error);
  }

  return ajax.getJSON(Config.API_BASE_URL + '/me', createHeaders(auth))
    // .delay(2000)    // DEBUG: Delay for simulation purposes only
    .map((res: any) => createUserFromApiResponse(res))
    .catch((error: AjaxError) => {
      const loadUserError: LoadUserError = {
        params,
        error,
      };

      return Observable.throw(loadUserError);
    });
}

interface LoadUserError {
  params: LoadUserParams;
  error: AjaxError | Error;
}
