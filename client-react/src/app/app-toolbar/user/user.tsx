import * as React from 'react';
import { User as UserModel } from '../../shared/user/user';
import styled from 'styled-components';
import colors from '../../shared/colors/colors';
import Avatar from '../../shared/avatar/avatar';

const User = ({user}: Props) => (
  <UserStyled>
    <Avatar user={user} size="small"/> {user.name}
  </UserStyled>
);

export interface Props {
  user: UserModel;
}

const UserStyled = styled.span`
  color: ${colors.greyGrit};
  font-size: 13px;
`;

export default User;
