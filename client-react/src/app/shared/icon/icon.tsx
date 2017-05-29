import * as React from 'react';

const Icon = ({id, size, className}: Props) => {
  const sizeClass = size
    ? ` fa-${size}x`
    : '';

  return <i className={[`fa fa-${id}` + sizeClass, className].join(' ')}/>;
};

interface Props {
  id: any;
  size: any;
  className?: string;
}

export default Icon;
