import * as React from 'react';
import { Redirect, Route } from 'react-router';
import { connect } from 'react-redux';
import { StoreState } from '../store/store-state';

const foo = false;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    foo ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/sign-in',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

const mapStateToProps = ({auth}: StoreState) => ({
  auth,
});

export default connect<any, any, any>(mapStateToProps)(PrivateRoute);
