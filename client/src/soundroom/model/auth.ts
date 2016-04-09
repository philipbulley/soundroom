import {AuthState} from "./state/auth.state.ts";
import {User} from "./user";

export class Auth {

  state:AuthState = AuthState.LOGGED_OUT;
  user:User;

}
