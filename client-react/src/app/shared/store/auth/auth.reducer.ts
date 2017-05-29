import { Auth } from './auth';
import { AuthStatus } from './auth-state';
import { LOAD_USER, LoadUser } from './load-user/load-user.action';
import { loadUserCommand } from './load-user/load-user.command';

const defaultState: Auth = {
  status: AuthStatus.LOGGED_OUT,
  user: null,
  jwt: null,
};

/** A union of action payloads that this reducer will accept */
export type AuthActions = LoadUser/* | DecrementEnthusiasm*/;

export function authReducer(state: Auth = defaultState, action: AuthActions): Auth {
  switch (action.type) {
    case LOAD_USER:
      return loadUserCommand(state, action);
    default:
      return state;
  }
}
