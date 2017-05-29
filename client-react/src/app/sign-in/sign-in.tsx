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

const SignIn = ({auth, goToRooms}: StateProps & DispatchProps & RouteComponentProps<{}>) => {
  const statusMarkup = {
    [AuthStatus.LOADING]: (
      <div>
        <Heading>Sign-in</Heading>
        <h3><i className="fa fa-circle-o-notch fa-spin"/> Logging in...</h3>
      </div>
    ),
    [AuthStatus.LOGGED_IN]: (
      <div>
        <Heading>{auth.user ? auth.user.name : `You're`} in da house!</Heading>
        <a onClick={goToRooms}>Let's get started</a>
      </div>
    ),
    [AuthStatus.LOGGED_OUT]: (
      <div>
        <Heading>Sign-in</Heading>
        <SignInSocial serverBaseUrl={Config.SERVER_BASE_URL}/>
      </div>
    )
  };

  return statusMarkup[auth.status];
};

interface StateProps {
  auth: Auth;
}

interface DispatchProps {
  goToRooms: () => {};
}

const Heading = styled.h2`
  text-align: center;
`;

const mapStateToProps = ({auth}: StoreState) => ({
  auth,
});

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  goToRooms: () => dispatch(push('/'))
});

export default connect<StateProps, DispatchProps, RouteComponentProps<{}>>(mapStateToProps, mapDispatchToProps)(SignIn);
