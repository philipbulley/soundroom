import * as React from 'react';
import { User } from '../model/user/user';
import styled from 'styled-components';

const Avatar: React.StatelessComponent<Props> = ({ user, className, ...rest }: Props) => (
	<img className={className} {...rest} src={user.avatar} alt={user.name} title={user.name} />
);

interface Props {
	user: User;
	size: AvatarSize;
	className?: string;
}

const sizesPx = {
	small: 30,
	medium: 50
};

type AvatarSize = 'small' | 'medium';
const avatarSizeDefault: AvatarSize = 'medium';

export default styled(Avatar)`
	width: ${(props: Props) => sizesPx[props.size || avatarSizeDefault]}px;
	height: ${(props: Props) => sizesPx[props.size || avatarSizeDefault]}px;
	border-radius: ${(props: Props) => sizesPx[props.size || avatarSizeDefault]}px;
	vertical-align: middle;
	border: 1px solid #eee;
`;
