import * as React from 'react';
import { Redirect, Route } from 'react-router';
import { connect } from 'react-redux';
import { StoreState } from '../store/store-state';
import { Auth } from '../store/auth/auth';
import { AuthStatus } from '../store/auth/auth-state';

const AuthRoute = ({ component: Component, auth, ...rest }) => (
	<Route
		{...rest}
		// tslint:disable-next-line:jsx-no-lambda
		render={props =>
			auth.status === AuthStatus.LOGGED_IN ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/sign-in',
						state: { from: props.location }
					}}
				/>
			)
		}
	/>
);

interface StateProps {
	auth: Auth;
}

const mapStateToProps = ({ auth }: StoreState) => ({
	auth
});

export default connect<StateProps, any, any>(mapStateToProps)(AuthRoute);
