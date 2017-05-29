import { Auth } from '../auth';
import { AuthStatus } from '../auth-state';
import { LoadUser } from './load-user.action';

export const loadUserCommand = (state: Auth, payload: LoadUser): Auth => {
  state = {...state};
  state.status = AuthStatus.LOADING;
  delete state.error;

  if (payload && payload.jwt) {
    state.jwt = payload.jwt;
  }

  return state;
};
