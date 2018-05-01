import * as React from 'react';
import { User as UserModel } from '../../shared/model/user/user';
import styled from 'styled-components';
import colors from '../../shared/colors/colors';
import Avatar from '../../shared/avatar/avatar';

const User = ({ user, className }: Props) => (
	<span className={className}>
		<Avatar user={user} size="small" /> {user.name}
	</span>
);

export interface Props {
	className?: string;
	user: UserModel;
}

export default styled(User)`
	color: ${colors.greyGrit};
	font-size: 13px;
`;
