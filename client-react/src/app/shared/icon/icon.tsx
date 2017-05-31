import * as React from 'react';

const Icon = ({id, size, className}: Props) => {
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

  return <i className={classes.join(' ')}/>;
};

interface Props {
  id: any;
  size?: any;
  className?: string;
}

export default Icon;
