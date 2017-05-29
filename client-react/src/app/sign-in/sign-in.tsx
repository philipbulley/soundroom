import * as React from 'react';
import { StoreState } from '../shared/store/store-state';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Auth } from '../shared/store/auth/auth';
import { AuthStatus } from '../shared/store/auth/auth-state';
import { push } from 'react-router-redux';
import SignInSocial from './sign-in-social/sign-in-social';
import { Config } from '../shared/model/config';
import styled from 'styled-components';
import loadUserAction from '../shared/store/auth/load-user/load-user.action';
import { AuthActions } from '../shared/store/auth/auth.reducer';

type ConnectedProps = StateProps & DispatchProps & RouteComponentProps<{}>;

class SignIn extends React.Component<ConnectedProps, {}> {
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const jwt = params.get('jwt');
    if (jwt) {
      this.props.loadUser(jwt);
    }
  }

  render() {
    const {auth, goToRooms} = this.props;

    return (
      <div>
        {AuthStatus.LOGGED_OUT === auth.status && (
          <div>
            <Heading>Sign-in</Heading>
            <SignInSocial serverBaseUrl={Config.SERVER_BASE_URL}/>
          </div>
        )}

        {AuthStatus.LOADING === auth.status && (
          <div>
            <Heading>Sign-in</Heading>
            <h3><i className="fa fa-circle-o-notch fa-spin"/> Logging in...</h3>
          </div>
        )}

        {AuthStatus.LOADING === auth.status && (
          <div>
            <Heading>{auth.user ? auth.user.name : `You're`} in da house!</Heading>
            <a onClick={goToRooms}>Let's get started</a>
          </div>
        )}
      </div>
    );
  }
}

interface StateProps {
  auth: Auth;
}

interface DispatchProps {
  goToRooms: () => {};
  loadUser: (jwt: string) => {};
}

const Heading = styled.h2`
  text-align: center;
`;

const mapStateToProps = ({auth}: StoreState) => ({
  auth,
});

const mapDispatchToProps = (dispatch: Dispatch<AuthActions>): DispatchProps => ({
  goToRooms: () => dispatch(push('/')),
  loadUser: (jwt) => dispatch(loadUserAction(jwt)),
});

export default connect<StateProps, DispatchProps, RouteComponentProps<{}>>(mapStateToProps, mapDispatchToProps)(SignIn);
