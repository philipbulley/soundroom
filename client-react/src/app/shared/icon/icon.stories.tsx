import * as React from 'react';
import './../../../index.css';
import { storiesOf } from '@storybook/react';
// import { withKnobs, number } from '@storybook/addon-knobs';
import Icon from './icon';

// const largerSizesSizeKnob = number('Size', 5, {
//   range: true,
//   min: 2,
//   max: 5,
//   step: 1,
// });

const DESC_INTRO = `Icon allows you to use Font Awesome icons within the app. 
The id prop should be the usual font awesome icon name.`;

storiesOf('Icon', module)
	.addWithInfo('normal size', DESC_INTRO, () => <Icon id="spotify" />)
	.addWithInfo(
		'larger sizes',
		`${DESC_INTRO} The size prop can be between 2 and 5 as per
    font awesome's larger icons (http://fontawesome.io/examples/#larger)`,
		() => (
			<div>
				<Icon id="spotify" size={2} />
				<Icon id="spotify" size={3} />
				<Icon id="spotify" size={4} />
				<Icon id="spotify" size={5} />
			</div>
		)
	)
	.addWithInfo(
		'spin',
		`${DESC_INTRO} Use the 'spin' prop to make the icon rotate.`,
		() => <Icon id="circle-o-notch" spin />
	);
