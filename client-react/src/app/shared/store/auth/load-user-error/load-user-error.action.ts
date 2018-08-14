import { LoadUserErrorResult } from './load-user-error-result';
import { AuthActionType } from '../auth-action-types';

const loadUserErrorAction = (payload: LoadUserErrorResult): LoadUserErrorAction => ({
	type: AuthActionType.LOAD_USER_ERROR,
	payload
});

export interface LoadUserErrorAction {
	type: AuthActionType.LOAD_USER_ERROR;
	payload: LoadUserErrorResult;
}

export default loadUserErrorAction;
