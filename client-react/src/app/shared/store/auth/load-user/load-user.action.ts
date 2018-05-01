import { AuthActionType } from '../auth-action-types';

const loadUserAction = (jwt?: string): LoadUserAction => ({
	type: AuthActionType.LOAD_USER,
	payload: {
		jwt
	}
});

export interface LoadUserAction {
	type: AuthActionType.LOAD_USER;
	payload: LoadUserParams;
}

export interface LoadUserParams {
	jwt?: string;

	// TODO(client-react): Implement or remove
	skipSignInRedirectOnError?: boolean;
}

export default loadUserAction;
