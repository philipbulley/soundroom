import { Auth } from './auth';
import { AuthStatus } from './auth-state';

const defaultState: Auth = {
  status: AuthStatus.LOGGED_OUT,
  user: null,
  jwt: null,
};

export function authReducer(state: Auth = defaultState, action: string): Auth {
  return {...state};
}