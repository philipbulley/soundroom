import * as React from 'react';
import { StoreState } from '../shared/store/store-state';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Auth } from '../shared/store/auth/auth';

const SignIn = ({auth}: StateProps & RouteComponentProps<{}>) => (
  <div>
    <h2>Sign-in</h2>
    AuthStatus: {auth.status}
  </div>
);

interface StateProps {
  auth: Auth;
}

const mapStateToProps = ({auth}: StoreState) => ({
  auth,
});

export default connect<StateProps, void, RouteComponentProps<{}>>(mapStateToProps)(SignIn);
