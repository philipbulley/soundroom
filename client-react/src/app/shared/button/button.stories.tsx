import * as React from 'react';
import './../../../index.css';
import { storiesOf } from '@storybook/react';
import Button from './button';

storiesOf('Button', module)
  .addWithInfo(
    'default',
    `A default button.`,
    () => (
      <Button>Click me!</Button>
    ),
  );
