import { Auth } from '../../../model/auth';

export const addCachedUserCommand = (state: Auth, jwt: string): Auth => {

  state = Object.assign({}, state);
  state.jwt = jwt;

  return state;
};
