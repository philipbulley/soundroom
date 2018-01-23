import { User } from '../../../model/user/user';
import { AuthActionType } from '../auth-action-types';

const loadUserSuccessAction = (payload: User): LoadUserSuccessAction => ({
  type: AuthActionType.LOAD_USER_SUCCESS,
  payload,
});

export interface LoadUserSuccessAction {
  type: AuthActionType.LOAD_USER_SUCCESS;
  payload: User;
}

export default loadUserSuccessAction;
