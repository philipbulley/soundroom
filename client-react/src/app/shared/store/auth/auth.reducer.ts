import { Auth } from './auth';
import { AuthStatus } from './auth-state';
import { loadUserCommand } from './load-user/load-user.command';
import { loadUserSuccessCommand } from './load-user-success/load-user-success.command';
import { loadUserErrorCommand } from './load-user-error/load-user-error.command';
import { getPersistedJwt } from '../../auth/auth.service';
import { AuthActionType, AuthActions } from './auth-action-types';

const defaultState: Auth = {
	status: AuthStatus.LOGGED_OUT,
	user: null,
	jwt: getPersistedJwt()
};

export function authReducer(state: Auth = defaultState, action: AuthActions): Auth {
	switch (action.type) {
		case AuthActionType.LOAD_USER:
			return loadUserCommand(state, action.payload);
		case AuthActionType.LOAD_USER_SUCCESS:
			return loadUserSuccessCommand(state, action.payload);
		case AuthActionType.LOAD_USER_ERROR:
			return loadUserErrorCommand(state, action.payload);
		default:
			return state;
	}
}
