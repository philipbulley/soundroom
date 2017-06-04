import {configure, setAddon, addDecorator} from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import React from 'react';

setAddon(infoAddon);

addDecorator((story) => (
  <div style={{padding: '40px'}}>
    {story()}
  </div>
));

const req = require.context('../src/app', true, /\.stories\.tsx$/);
// const req = require.context('../src/app/shared/error/inline-error', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys()
    .forEach((filename) => req(filename));
}

configure(loadStories, module);
