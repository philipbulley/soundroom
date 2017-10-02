import { LoadUserAction, LoadUserParams } from './load-user.action';
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
import 'rxjs/add/observable/fromPromise';
import { User } from '../../../user/user';
import { Config } from '../../../model/config';
import { StoreState } from '../../store-state';
import { createHeaders, fetchRx } from '../../../network-helper';
import { Epic } from 'redux-observable';
import { Auth } from '../auth';
import { setPersistedJwt } from '../../../auth/auth.service';
import { AuthActions, AuthActionType } from '../auth-action-types';

export const PATH: string = '/me';

export const loadUserEpic: Epic<AuthActions, StoreState> = (action$, store) => action$
  .filter(action => action.type === AuthActionType.LOAD_USER)
  .do((action: LoadUserAction) => {
    if (action.payload.jwt) {
      // Persist the JWT
      setPersistedJwt(action.payload.jwt);
    }
  })
  .switchMap((action: LoadUserAction) => {
    return makeLoginRequest(store.getState().auth, action.payload)
      .map((user: User) => loadUserSuccessAction(user))
      .catch((loadUserError: LoadUserError) => {
        return Observable.of(loadUserErrorAction({
          type: null, // TODO: Define error types for this kind of error?
          skipSignInRedirect: !!(loadUserError.params && loadUserError.params.skipSignInRedirectOnError),
          status: loadUserError.error instanceof Response
            ? loadUserError.error.status
            : 0,
          message: (loadUserError.error instanceof Response
            ? loadUserError.error.statusText
            : loadUserError.error.message) || 'Unable to load user',
        }));
      });
  });

function makeLoginRequest(auth: Auth, params: LoadUserParams): Observable<User> {
  if (!auth.jwt) {
    const error: LoadUserError = {
      params,
      error: new Error('No cached JWT'),
    };
    return Observable.throw(error);
  }

  return fetchRx(Config.API_BASE_URL + PATH, {headers: createHeaders(auth)})
  // .delay(2000)    // DEBUG: Delay for simulation purposes only
    .switchMap((res: Response): Observable<User> => Observable.fromPromise(res.json()))
    .catch((error: Response) => {
      const loadUserError: LoadUserError = {
        params,
        error,
      };

      return Observable.throw(loadUserError);
    });
}

interface LoadUserError {
  params: LoadUserParams;
  error: Response | Error;
}
