import * as React from 'react';
import { User } from '../user/user';
import styled from 'styled-components';

const Avatar = ({user, ...rest}: Props) => (
  <AvatarStyled {...rest} src={user.avatar} />
);

interface Props {
  user: User;
  size: AvatarSize;
}

const sizesPx = {
  small: 30,
  medium: 50,
};

type AvatarSize = 'small' | 'medium';
const avatarSizeDefault: AvatarSize = 'medium';

interface AvatarStyledProps {
  // TODO(ts@2.3.3): why can't I type size as AvatarSize?
  size: any;
}

const AvatarStyled = styled.img`
  width: ${(props: AvatarStyledProps) => sizesPx[props.size || avatarSizeDefault]}px;
  height: ${(props: AvatarStyledProps) => sizesPx[props.size || avatarSizeDefault]}px;
  border-radius: ${(props: AvatarStyledProps) => sizesPx[props.size || avatarSizeDefault]}px;
  vertical-align: middle;
  border: 1px solid #eee;
`;

export default Avatar;
