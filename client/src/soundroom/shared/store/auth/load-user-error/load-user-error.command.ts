import { Auth } from '../../../model/auth';
import { ErrorResult } from '../../../model/error/error-result';
import { AuthState } from '../../../model/state/auth.state';

export const loadUserErrorCommand = (state: Auth, error: ErrorResult): Auth => {
  state = Object.assign({}, state);
  state.state = AuthState.LOGGED_OUT;
  state.user = null;
  state.error = error;

  return state;
};
