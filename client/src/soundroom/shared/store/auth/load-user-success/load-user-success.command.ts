import { Auth } from '../../../model/auth';
import { User } from '../../../model/user';
import { AuthState } from '../../../model/state/auth.state';

export const loadUserSuccessCommand = (state: Auth, user: User): Auth => {
  state = Object.assign({}, state);
  state.state = user
    ? AuthState.LOGGED_IN
    : AuthState.LOGGED_OUT;

  state.user = user;

  return state;
};
