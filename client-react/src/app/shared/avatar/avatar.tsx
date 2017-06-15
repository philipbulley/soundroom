import * as React from 'react';
import { User } from '../user/user';
import styled from 'styled-components';

const Avatar = ({user}: Props) => (
  <AvatarStyled src={user.avatar}/>
);

interface Props {
  user: User;
  small?: boolean;
  medium?: boolean;
}

const sizesPx = {
  small: 30,
  medium: 40,
};

const AvatarStyled = styled.img`
  width: ${sizesPx.small}px;
  height: ${sizesPx.small}px;
  border-radius: ${sizesPx.small / 2}px;
  vertical-align: middle;
  border: 1px solid #eee;
`;

export default Avatar;
