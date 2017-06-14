import * as React from 'react';
import { User as UserModel } from '../../shared/user/user';
import styled from 'styled-components';
import colors from '../../shared/colors/colors';

const User = ({user}: Props) => (
  <UserStyled className="user">
    <img className="o-avatar" src={user.avatar}/> {user.name}
  </UserStyled>
);

export interface Props {
  user: UserModel;
}

const UserStyled = styled.div`
  color: ${colors.greyGrit};
  font-size: 13px;
`;

export default User;
