import * as React from 'react';
import colors from '../colors/colors';
import { darken } from 'polished';
import buttonReset from './button-reset';
import { SyntheticEvent } from 'react';
import { css, default as styled } from 'styled-components';

const Button: React.StatelessComponent<Props> = ({
	children,
	onClick,
	className,
	innerRef,
	...rest
}: Props) => (
	<ButtonStyled
		{...rest}
		className={className}
		onClick={onClick}
		innerRef={innerRef}
	>
		{children}
	</ButtonStyled>
);

interface Props {
	children: any;
	className?: string;
	onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void;
	green?: boolean;
	noStyle?: boolean;
	disabled?: boolean;
	innerRef?: (ref: HTMLElement | any) => void;
}

function getColor(props: Props) {
	if (props.green) {
		return {
			color: colors.green,
			backgroundColor: colors.white
		};
	}

	return {
		color: colors.greyGrime,
		backgroundColor: colors.greyDust
	};
}

const ButtonStyled = styled.button`
  ${buttonReset}
  
  ${(props: Props) =>
		!props.noStyle
			? css`
					padding: 14px 30px;

					font-size: 16px;
					border-radius: 4px;
					color: ${getColor(props).color};
					background: ${getColor(props).backgroundColor};
					font-weight: bold;
					transition: background-color 0.4s linear, color 0.4s linear;
					outline: 0;

					&:hover {
						background-color: ${darken(0.2, getColor(props).color)};
						color: ${getColor(props).backgroundColor};
						transition: background-color 0s, color 0s;
					}
			  `
			: ''}
  
  ${(props: Props) =>
		props.disabled
			? css`
					pointer-events: none;
					opacity: 0.5;
			  `
			: ''}
`;

export default Button;
