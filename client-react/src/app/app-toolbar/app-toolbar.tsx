import * as React from 'react';
import { AuthStatus } from '../shared/store/auth/auth-state';
import { StoreState } from '../shared/store/store-state';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { Auth } from '../shared/store/auth/auth';
import AppToolbarStyled from './app-toolbar.styled';
import Logo from './logo.styled';
import User from './user/user';
import { User as UserModel } from '../shared/user/user';
import { RouteComponentProps } from 'react-router';
import { AuthActions } from '../shared/store/auth/auth-action-types';

const AppToolbar = ({auth, goHome, goToSignIn}: Props) => (
  <AppToolbarStyled>
    <nav>
      <div className="main">
        <Logo onClick={goHome}>Soundroom</Logo>
        {/*Only enable sign-in link below if we eventually have NoAuth pages other than sign-in*/}
        {/*{AuthStatus.LOGGED_IN !== auth.status && <a onClick={goToSignIn}>Sign In</a>}*/}

        {AuthStatus.LOGGED_IN === auth.status && <User user={auth.user as UserModel}/>}
      </div>
      <div className="meta">
        {/*Right nav items can go here*/}
      </div>
    </nav>
  </AppToolbarStyled>
);

type Props = StateProps & DispatchProps;

interface StateProps {
  auth: Auth;
}

interface DispatchProps {
  goHome: () => void;
  goToSignIn: () => void;
}

const mapStateToProps = ({auth}: StoreState) => ({
  auth,
});

const mapDispatchToProps = (dispatch: Dispatch<AuthActions>): DispatchProps => ({
  goHome: () => dispatch(push('/')),
  goToSignIn: () => dispatch(push('/sign-in')),
});

export default connect<StateProps, DispatchProps, RouteComponentProps<{}>>(mapStateToProps, mapDispatchToProps)(
  AppToolbar);
