import * as React from 'react';
import './../../../index.css';
import { storiesOf } from '@storybook/react';
import Icon from './icon';

storiesOf('Icon', module)
  .addWithInfo(
    'normal size',
    `Icon allows you to use Font Awesome icons within the app. The id prop should be the usual font awesome icon name.`,
    () => (<Icon id="spotify"/>),
  )
  .addWithInfo(
    'larger sizes',
    `Icon allows you to use Font Awesome icons within the app. 
    The id prop should be the usual font awesome icon name. The size prop can be between 2 and 5 as per 
    font awesome's larger icons (http://fontawesome.io/examples/#larger)`,
    () => (<Icon id="spotify" size="5"/>),
  );

