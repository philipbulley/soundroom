import * as React from 'react';
import colors from '../colors/colors';
import { darken } from 'polished';
import buttonReset from './button-reset';
import { SyntheticEvent } from 'react';
import { css, default as styled } from 'styled-components';

const ButtonComponent: React.StatelessComponent<Props> = ({children, onClick, className, ...rest}: Props) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
);

interface Props {
  children: any;
  className?: string;
  onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  green?: boolean;
  noStyle?: boolean;
  disabled?: boolean;
}

function getColor(props: Props) {
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

const Button = styled(ButtonComponent)`
  ${buttonReset}
  
  ${(props: Props) => !props.noStyle
  ? css`
    padding: 14px 30px;
  
    font-size: 16px;
    border-radius: 4px;
    color: ${getColor(props).color};
    background: ${getColor(props).backgroundColor};
    font-weight: bold;
    transition: background-color .4s linear, color .4s linear;
    outline: 0;
  
    &:hover {
      background-color: ${darken(0.2, getColor(props).color)};
      color: ${getColor(props).backgroundColor};
      transition: background-color 0s, color 0s;
    }
  ` : ''}
  
  ${(props: Props) => props.disabled
  ? css`
    pointer-events: none;
    opacity: .5;
  ` : ''}
`;

export default Button;
