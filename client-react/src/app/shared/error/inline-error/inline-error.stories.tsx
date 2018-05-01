import * as React from 'react';
import './../../../../index.css';
import { storiesOf } from '@storybook/react';
import InlineError from './inline-error';

const MOCK_CHILDREN = `Sorry! The Soundroom server can't reach Spotify — your track hasn't been added.`;
const MOCK_MESSAGE = `Can't reach Spotify provider`;
const MOCK_STATUS = 500;

storiesOf('InlineError', module)
	.addWithInfo(
		'with a friendly message',
		`A simple way to communicate an error to the end user.`,
		() => <InlineError>{MOCK_CHILDREN}</InlineError>
	)
	.addWithInfo(
		'with debug info',
		`A simple way to communicate an error to the end user with added context that may be useful when reporting the 
    error to the developers.`,
		() => (
			<InlineError message={MOCK_MESSAGE} status={MOCK_STATUS}>
				{MOCK_CHILDREN}
			</InlineError>
		)
	);
