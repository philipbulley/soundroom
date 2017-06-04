import * as React from 'react';
import './../../../../index.css';
import { storiesOf } from '@storybook/react';
import InlineError from './inline-error';

const MOCK_CHILDREN = 'I am a user friendly description of error';
const MOCK_MESSAGE = 'I am the original error message for extra verbosity';
const MOCK_STATUS = 404;

storiesOf('InlineError', module)
  .add('with children', () => (<InlineError>{MOCK_CHILDREN}</InlineError>))
  .add('with a message prop', () => (<InlineError message={MOCK_MESSAGE}/>))
  .add('with a status prop', () => (<InlineError status={MOCK_STATUS}/>))
  .add('with message and status props', () => (<InlineError message={MOCK_MESSAGE} status={MOCK_STATUS}/>))
  .add('with children, message and status props',
    () => (<InlineError message={MOCK_MESSAGE} status={404}>{MOCK_CHILDREN}</InlineError>));
