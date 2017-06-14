import * as React from 'react';
import { AuthStatus } from '../shared/store/auth/auth-state';
import { StoreState } from '../shared/store/store-state';
import { connect, Dispatch } from 'react-redux';
import { AuthActions } from '../shared/store/auth/auth.reducer';
import { push } from 'react-router-redux';
import { Auth } from '../shared/store/auth/auth';
import styled from 'styled-components';
import ContentContainer from '../shared/layout/content-container';
import colors from '../shared/colors/colors';
import User from './user/user';
import { User as UserModel } from '../shared/user/user';
import { RouteComponentProps } from 'react-router';

const AppToolbar = ({auth, goHome, goToSignIn}: Props) => (
  <AppToolbarStyled>
    <ContentContainer className="content-container">
      <div className="main">
        <Logo onClick={goHome}>Soundroom</Logo>
        {AuthStatus.LOGGED_IN !== auth.status && <a onClick={goToSignIn}>Sign In</a>}

        {AuthStatus.LOGGED_IN === auth.status && <User user={auth.user as UserModel}/>}
      </div>
      <div className="meta">
        {/*Right nav items can go here*/}
      </div>
    </ContentContainer>
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

const AppToolbarStyled = styled.nav`
    position: sticky;
    width: 100%;
    height: 60px;
    background-color: ${colors.white};
    border-bottom: ${colors.greyDust} 1px solid;
    
    .content-container {
      display: flex;
      line-height: 60px;
    }
    
    .main {
      flex: 2 1 auto;
    }
    
    .meta {
      flex: 1 1 auto;
      text-align: right;
    }
`;

const Logo = styled.a`
  margin: 0 40px 0 0;
  color: ${colors.blackShade};
  text-decoration: none;
  font-weight: bold;
`;

const mapStateToProps = ({auth}: StoreState) => ({
  auth,
});

const mapDispatchToProps = (dispatch: Dispatch<AuthActions>): DispatchProps => ({
  goHome: () => dispatch(push('/')),
  goToSignIn: () => dispatch(push('/sign-in')),
});

export default connect<StateProps, DispatchProps, RouteComponentProps<{}>>(mapStateToProps, mapDispatchToProps)(
  AppToolbar);
