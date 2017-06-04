// import {configure} from '@storybook/react';
//
// function loadStories() {
//   require('../src/app/shared/error/inline-error');
// }
//
// configure(loadStories, module);

import {configure} from '@storybook/react';

const req = require.context('../src/app', true, /\.stories\.tsx$/);
// const req = require.context('../src/app/shared/error/inline-error', true, /\.stories\.tsx$/);

function loadStories() {
  req.keys()
    .forEach((filename) => req(filename));
}

configure(loadStories, module);
