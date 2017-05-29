import * as React from 'react';
import { StoreState } from '../shared/store/store-state';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Auth } from '../shared/store/auth/auth';
import { AuthStatus } from '../shared/store/auth/auth-state';
import { push } from 'react-router-redux';
import SignInSocial from './sign-in-social/sign-in-social';
import { Config } from '../shared/model/config';

const SignIn = ({auth, goToRooms}: StateProps & DispatchProps & RouteComponentProps<{}>) => {
  switch (auth.status) {
    case AuthStatus.LOADING:
      return (
        <div>
          <h2>Sign-in</h2>
          <h3><i className="fa fa-circle-o-notch fa-spin"/> Logging in...</h3>
        </div>
      );
    case AuthStatus.LOGGED_IN:
      return (
        <div>
          <h2>{auth.user ? auth.user.name : `You're`} in da house!</h2>
          <a onClick={goToRooms}>Let's get started</a>
        </div>
      );
    default:
      return (
        <div>
          <h2>Sign-in</h2>
          <a onClick={goToRooms}>Let's get started</a>
          <SignInSocial serverBaseUrl={Config.SERVER_BASE_URL}/>
          <pre>AuthStatus: {auth.status}</pre>
        </div>
      );
  }
};

interface StateProps {
  auth: Auth;
}

interface DispatchProps {
  goToRooms: () => {};
}

const mapStateToProps = ({auth}: StoreState) => ({
  auth,
});

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  goToRooms: () => dispatch(push('/'))
});

export default connect<StateProps, DispatchProps, RouteComponentProps<{}>>(mapStateToProps, mapDispatchToProps)(SignIn);
