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
import InlineError from '../shared/error/inline-error/inline-error';
import Icon from '../shared/icon/icon';

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
            {
              auth.error &&
              <InlineError message={auth.error.message}>
                We haven't been able to sign you in.
              </InlineError>
            }
            <SignInSocial serverBaseUrl={Config.SERVER_BASE_URL}/>
          </div>
        )}

        {AuthStatus.LOADING === auth.status && (
          <div>
            <Heading>Sign-in</Heading>
            <h3><Icon id="circle-o-notch" spin/> Logging in...</h3>
          </div>
        )}

        {AuthStatus.LOGGED_IN === auth.status && (
          <div>
            <Heading>{auth.user ? auth.user.name : `You're`} in da house!</Heading>
            <button onClick={goToRooms}>Let's get started</button>
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
