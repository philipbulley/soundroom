import * as React from 'react';

const Icon = ({id, size, className, spin}: Props) => {
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

  return <i className={classes.join(' ')}/>;
};

interface Props {
  id: any;
  size?: any;
  className?: string;
  spin?: boolean;
}

export default Icon;
