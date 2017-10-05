import * as React from 'react';
import styled from 'styled-components';
import colors from '../../shared/colors/colors';
import Icon from '../../shared/icon/icon';
import { getSocialProviderColor } from '../../shared/colors/colors-helper';
import { SocialProvider } from '../../shared/model/social-provider';

const SignInSocialButton = ({serverBaseUrl, provider, className}: Props) => (
  <Anchor className={className} href={serverBaseUrl + '/auth/' + provider} provider={provider}>
    <IconStyled id={provider} size="3"/>
  </Anchor>
);

interface Props {
  provider: SocialProvider;
  serverBaseUrl: string;
  className?: string;
}

interface AnchorProps {
  provider: SocialProvider;
}

const IconStyled = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translate3d(0, -50%, 0);
`;

const Anchor = styled.a`
  color: ${colors.greyGrit};
  text-decoration: none;
  display: inline-block;
  background: ${colors.white};
  width: 10vw;
  height: 10vw;
  min-width: 75px;
  min-height: 75px;
  position: relative;
  text-align: center;

  transition: background .2s linear, color .2s linear;
  
  &:hover {
    color: ${colors.white};
    background: ${(props: AnchorProps) => getSocialProviderColor(props.provider)};
    transition: background .1s linear, color .1s linear;
  }
`;

export default SignInSocialButton;
