import * as React from 'react';
import './../../../index.css';
import { storiesOf } from '@storybook/react';
import Avatar from './avatar';
import { MOCK_USER } from '../user/user.mock';

const DESC_INTRO = `Passing a user object to an Avatar component will display the user's image`;

storiesOf('Avatar', module)
  .addWithInfo(
    'medium size',
    DESC_INTRO,
    () => (<Avatar size="medium" user={MOCK_USER}/>),
  )
  .addWithInfo(
    'small size',
    DESC_INTRO,
    () => (<Avatar size="small" user={MOCK_USER}/>),
  );

