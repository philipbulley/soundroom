import * as React from 'react';
import './../../../index.css';
import { storiesOf } from '@storybook/react';
import Icon from './icon';

storiesOf('Icon', module)
  .add('with id prop', () => (<Icon id="spotify"/>))
  .add('with id and size', () => (<Icon id="spotify" size="5"/>));

