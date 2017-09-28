import { Auth } from './auth';
import { AuthStatus } from './auth-state';
import { LOAD_USER, LoadUserAction } from './load-user/load-user.action';
import { loadUserCommand } from './load-user/load-user.command';
import { LOAD_USER_SUCCESS, LoadUserSuccessAction } from './load-user-success/load-user-success.action';
import { loadUserSuccessCommand } from './load-user-success/load-user-success.command';
import { LOAD_USER_ERROR, LoadUserErrorAction } from './load-user-error/load-user-error.action';
import { loadUserErrorCommand } from './load-user-error/load-user-error.command';
import { getPersistedJwt } from '../../auth/auth.service';

const defaultState: Auth = {
  status: AuthStatus.LOGGED_OUT,
  user: null,
  jwt: getPersistedJwt(),
};

/** A union of action payloads that this reducer will accept */
export type AuthActions = LoadUserAction | LoadUserSuccessAction | LoadUserErrorAction;

export function authReducer(state: Auth = defaultState, action: AuthActions): Auth {
  switch (action.type) {
    case LOAD_USER:
      return loadUserCommand(state, action.payload);
    case LOAD_USER_SUCCESS:
      return loadUserSuccessCommand(state, action.payload);
    case LOAD_USER_ERROR:
      return loadUserErrorCommand(state, action.payload);
    default:
      return state;
  }
}
