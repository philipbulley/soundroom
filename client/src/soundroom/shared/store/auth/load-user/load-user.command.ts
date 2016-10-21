import { LoadUserParams } from './load-user-params';
import { Auth } from '../../../model/auth';
import { AuthState } from '../../../model/state/auth.state';

export const loadUserCommand = (state: Auth, payload: LoadUserParams): Auth => {

  state = Object.assign({}, state);
  state.state = AuthState.LOADING;
  state.error = null;

  return state;
};
