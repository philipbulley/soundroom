import { LoadUserErrorResult } from './load-user-error-result';

export const LOAD_USER_ERROR = 'LOAD_USER_ERROR';
export type LOAD_USER_ERROR = typeof LOAD_USER_ERROR;

export interface LoadUserErrorAction {
  type: LOAD_USER_ERROR;
  payload: LoadUserErrorResult;
}

const loadUserErrorAction = (payload: LoadUserErrorResult): LoadUserErrorAction => ({
  type: LOAD_USER_ERROR,
  payload,
});

export default loadUserErrorAction;
