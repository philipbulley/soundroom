import * as React from 'react';
import colors from '../colors/colors';
import { darken } from 'polished';
import ButtonReset from './button-reset';
import { SyntheticEvent } from 'react';

const Button = ({children, onClick, ...rest}: Props) => (
  <ButtonStyled {...rest} onClick={onClick}>
    {children}
  </ButtonStyled>
);

interface Props {
  children: any;
  onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  green?: boolean;
}

interface ButtonStyledProps {
  green?: boolean;
}

// TODO(styled-components): Remove square brackets when issue fixed:
// https://github.com/styled-components/styled-components/issues/870
// tslint:disable-next-line
const ButtonStyled = ButtonReset['extend']`
  padding: 14px 30px;

  border-radius: 4px;
  color: ${(props: ButtonStyledProps) => getColor(props).color};
  background: ${(props: ButtonStyledProps) => getColor(props).backgroundColor};
  font-weight: bold;
  transition: background-color .4s linear, color .4s linear;
  outline: 0;

  &:hover {
    background-color: ${(props: ButtonStyledProps) => darken(0.2, getColor(props).color)};
    color: ${(props: ButtonStyledProps) => getColor(props).backgroundColor};
    transition: background-color 0s, color 0s;
  }
`;

function getColor(props: ButtonStyledProps) {
  if (props.green) {
    return {
      color: colors.green,
      backgroundColor: colors.white,
    };
  }

  return {
    color: colors.greyGrime,
    backgroundColor: colors.greyDust,
  };
}

export default Button;
