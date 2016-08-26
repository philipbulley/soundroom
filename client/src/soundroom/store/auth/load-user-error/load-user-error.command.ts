import { Auth } from "../../../model/auth";
import { AuthState } from "../../../model/state/auth.state";
import { ErrorResult } from "../../../model/error-result";

export const loadUserErrorCommand = ( state: Auth, error: ErrorResult ): Auth => {
  state = Object.assign({}, state);
  state.state = AuthState.LOGGED_OUT;
  state.user = null;
  state.error = error;

  return state;
};
