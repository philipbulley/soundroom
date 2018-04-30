import * as React from 'react';
import { ClassAttributes } from 'react';

const Icon = ({
                id, size, className, spin, innerRef = () => null, ...rest
              }: Props & ClassAttributes<HTMLElement>) => {
  const classes = [
    'fa',
    'fa-' + id,
  ];

  if (size) {
    classes.push(`fa-${size}x`);
  }

  if (className) {
    classes.push(className);
  }

  if (spin) {
    classes.push('fa-spin');
  }

  return <i {...rest} className={classes.join(' ')} style={{lineHeight: 0}} ref={innerRef}/>;
  };

interface Props {
  id: any;
  size?: any;
  className?: string;
  spin?: boolean;
  innerRef?: (ref: HTMLElement) => void;
}

export default Icon;
