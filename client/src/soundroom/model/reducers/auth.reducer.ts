import {ActionReducer, Action} from '@ngrx/store';
import {AuthAction} from "../action/auth.action.ts";
import {Auth} from "../auth";
import {AuthState} from "../state/auth.state.ts";

export const authReducer:ActionReducer<Auth> = ( state:Auth = new Auth, action:Action ) => {

  // console.log('authReducer():', action.type);
  // console.log(' - action:', action);
  // console.log(' - state:', state);

  let newState:Auth;

  switch (action.type) {

    case AuthAction.LOAD:
      newState = Object.assign(new Auth, state);
      newState.state = AuthState.LOADING;
      return newState;

    case AuthAction.POPULATE:
      newState = Object.assign(new Auth, state);
      newState.state = action.payload
        ? AuthState.LOGGED_IN
        : AuthState.LOGGED_OUT;
      newState.user = action.payload;
      return newState;

    default:
      return state;

  }
};
