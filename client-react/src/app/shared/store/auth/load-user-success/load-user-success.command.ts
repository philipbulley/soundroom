import { Auth } from '../auth';
import { AuthStatus } from '../auth-state';
import { User } from '../../../model/user/user';

export const loadUserSuccessCommand = (state: Auth, payload: User): Auth => {
  state = {...state};
  state.status = payload
    ? AuthStatus.LOGGED_IN
    : AuthStatus.LOGGED_OUT;

  state.user = payload;

  return state;
};
