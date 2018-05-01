import * as React from 'react';
import styled from 'styled-components';
import SignInSocialButton from './sign-in-social-button';
import { SocialProvider } from '../../shared/model/enum/social-provider';

const providers: SocialProvider[] = [
	SocialProvider.GOOGLE,
	SocialProvider.SPOTIFY,
	SocialProvider.TWITTER,
	SocialProvider.FACEBOOK
];

const SignInSocial = ({ serverBaseUrl }) => (
	<div>
		<Paragraph>
			If you've signed in before, please use the same social sign-in option as
			before.
		</Paragraph>
		<UnorderedList>
			{providers.map(provider => (
				<ListItem key={provider}>
					<SignInSocialButton
						serverBaseUrl={serverBaseUrl}
						provider={provider}
					/>
				</ListItem>
			))}
		</UnorderedList>
	</div>
);

const ListItem = styled.li`
	display: inline-block;
`;

const UnorderedList = styled.ul`
	text-align: center;
	list-style-type: none;
	padding: 0;
`;

const Paragraph = styled.p`
	text-align: center;
`;

export default SignInSocial;
