import { User } from '../../../user/user';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export type LOAD_USER_SUCCESS = typeof LOAD_USER_SUCCESS;

export interface LoadUserSuccessAction {
  type: LOAD_USER_SUCCESS;
  payload: User;
}

const loadUserSuccessAction = (payload: User): LoadUserSuccessAction => ({
  type: LOAD_USER_SUCCESS,
  payload,
});

export default loadUserSuccessAction;
