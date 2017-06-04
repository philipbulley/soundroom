import * as React from 'react';
import colors from '../colors/colors';
import { darken } from 'polished';
import ButtonReset from './button-reset';

const Button = ({children}: Props) => (
  <ButtonStyled>
    {children}
  </ButtonStyled>
);

interface Props {
  children: any;
}

// TODO(styled-components): Remove square brackets when issue fixed:
// https://github.com/styled-components/styled-components/issues/870
// tslint:disable-next-line
const ButtonStyled = ButtonReset['extend']`
  padding: 14px 30px;

  border-radius: 4px;
  color: ${colors.greyGrime};
  background: ${colors.greyDust};
  font-weight: bold;
  transition: background-color .4s linear, color .4s linear;
  outline: 0;

  &:hover {
    background-color: ${darken(0.2, colors.greyDust)};
    color: ${colors.greyDust};
    transition: background-color 0s, color 0s;
  }
`;

export default Button;
