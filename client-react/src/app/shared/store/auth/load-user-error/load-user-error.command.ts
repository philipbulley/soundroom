import { Auth } from '../auth';
import { AuthStatus } from '../auth-state';
import { LoadUserErrorResult } from './load-user-error-result';

export const loadUserErrorCommand = (state: Auth, payload: LoadUserErrorResult): Auth => {
	state = { ...state };
	state.status = AuthStatus.LOGGED_OUT;
	state.user = null;
	state.error = payload;

	return state;
};
