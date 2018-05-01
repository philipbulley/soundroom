import * as React from 'react';
import './../../../index.css';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from './button';
import colors from '../colors/colors';

storiesOf('Button', module)
	.addWithInfo('default', `A default button.`, () => (
		<Button onClick={action('clicked')}>Click me!</Button>
	))
	.addWithInfo(
		'green',
		`A green button.\n\nNOTE: Placed on darker background for Storybook illustrative purposes only.`,
		() => (
			<div
				style={{
					backgroundColor: colors.greyDust,
					padding: '20px',
					margin: '-20px'
				}}
			>
				<Button green onClick={action('clicked')}>
					Click me!
				</Button>
			</div>
		)
	)
	.addWithInfo(
		'noStyle',
		`An inline-block button with user agent style removed`,
		() => (
			<Button noStyle onClick={action('clicked')}>
				Click me!
			</Button>
		)
	);
