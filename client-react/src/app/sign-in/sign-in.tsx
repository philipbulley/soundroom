import * as React from 'react';
import { StoreState } from '../shared/store/store-state';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Auth } from '../shared/store/auth/auth';
import { AuthStatus } from '../shared/store/auth/auth-state';
import { push } from 'react-router-redux';
import SignInSocial from './sign-in-social/sign-in-social';
import { Config } from '../shared/model/config';
import loadUserAction from '../shared/store/auth/load-user/load-user.action';
import InlineError from '../shared/error/inline-error/inline-error';
import Icon from '../shared/icon/icon';
import Button from '../shared/button/button';
import { Helmet } from 'react-helmet';
import { AuthActions } from '../shared/store/auth/auth-action-types';
import { contentContainer } from '../shared/layout/content-container';
import styled from 'styled-components';

type ConnectedProps = StateProps &
	DispatchProps &
	RouteComponentProps<{}> &
	PassedProps;

class SignIn extends React.Component<ConnectedProps, {}> {
	componentDidMount() {
		const params = new URLSearchParams(this.props.location.search);

		// Check for URL based JWT first, otherwise try to get from store state
		const jwt = params.get('jwt') || this.props.auth.jwt;

		if (jwt) {
			this.props.loadUser(jwt);
		}
	}

	render() {
		const { auth, goToRooms, className } = this.props;

		return (
			<div className={className}>
				<Helmet>
					<title>Soundroom: Sign-in</title>
				</Helmet>
				{AuthStatus.LOGGED_OUT === auth.status && (
					<div>
						<h2>Sign-in</h2>
						{auth.error && (
							<InlineError message={auth.error.message}>
								We haven't been able to sign you in.
							</InlineError>
						)}
						<SignInSocial serverBaseUrl={Config.SERVER_BASE_URL} />
					</div>
				)}

				{AuthStatus.LOADING === auth.status && (
					<div>
						<h2>Sign-in</h2>
						<h3>
							<Icon id="circle-o-notch" spin /> Logging in...
						</h3>
					</div>
				)}

				{AuthStatus.LOGGED_IN === auth.status && (
					<div>
						<h2>{auth.user ? auth.user.name : `You're`} in da house!</h2>

						<Button onClick={goToRooms}>Let's get started</Button>
					</div>
				)}
			</div>
		);
	}
}

const SignInStyled = styled(SignIn)`
	${contentContainer} text-align: center;
`;

interface PassedProps {
	className?: string;
}

interface StateProps {
	auth: Auth;
}

interface DispatchProps {
	goToRooms: () => {};
	loadUser: (jwt: string) => {};
}

const mapStateToProps = ({ auth }: StoreState) => ({
	auth
});

const mapDispatchToProps = (
	dispatch: Dispatch<AuthActions>
): DispatchProps => ({
	goToRooms: () => dispatch(push('/')),
	loadUser: (jwt: string) => dispatch(loadUserAction(jwt))
});

export default connect<StateProps, DispatchProps, RouteComponentProps<{}>>(
	mapStateToProps,
	mapDispatchToProps
)(SignInStyled);
