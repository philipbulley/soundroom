import * as React from 'react';
import InlineError from './inline-error';
import { create } from 'react-test-renderer';

const MOCK_CHILDREN = 'I am a child string';
const MOCK_MESSAGE = 'I am a custom message';
const MOCK_STATUS = 1234;

describe('<InlineError />', () => {
  it('renders children', () => {
    const inlineError = create(<InlineError>{MOCK_CHILDREN}</InlineError>).toJSON();
    expect(inlineError).toMatchSnapshot();
  });

  it('renders message prop', () => {
    const inlineError = create(<InlineError message={MOCK_MESSAGE}/>).toJSON();
    expect(inlineError).toMatchSnapshot();
  });

  it('renders status prop', () => {
    const inlineError = create(<InlineError status={MOCK_STATUS}/>);
    expect(inlineError).toMatchSnapshot();
  });

  it('renders both message and status prop', () => {
    const inlineError = create(<InlineError message={MOCK_MESSAGE} status={MOCK_STATUS}/>);
    expect(inlineError).toMatchSnapshot();
  });

  it('renders children, message and status prop', () => {
    const inlineError = create(<InlineError message={MOCK_MESSAGE} status={MOCK_STATUS}>{MOCK_CHILDREN}</InlineError>);
    expect(inlineError).toMatchSnapshot();
  });
});
