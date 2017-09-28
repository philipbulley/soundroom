import { LoadUserAction } from './load-user/load-user.action';
import { LoadUserSuccessAction } from './load-user-success/load-user-success.action';
import { LoadUserErrorAction } from './load-user-error/load-user-error.action';

export enum AuthActionType {
  LOAD_USER = 'LOAD_USER',
  LOAD_USER_ERROR = 'LOAD_USER_ERROR',
  LOAD_USER_SUCCESS= 'LOAD_USER_SUCCESS',
}

export type AuthActions = LoadUserAction | LoadUserSuccessAction | LoadUserErrorAction;
