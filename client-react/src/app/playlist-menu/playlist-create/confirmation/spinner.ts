import posed from 'react-pose';
import { ConfirmationViewState } from './confirmation-view-state';
import { expoEaseIn, expoEaseOut } from '../../../shared/pose/easing';
import { tween } from 'popmotion';

const spinnerShow = {
	opacity: 1,
	scale: 1,
	y: 0,
	transition: props => tween({ ...props, duration: 300, ease: expoEaseOut })
};
const spinnerHideSuccessful = {
	opacity: 0,
	scale: 1,
	y: -20,
	transition: props => tween({ ...props, duration: 300, ease: expoEaseIn })
};
const spinnerHideError = {
	opacity: 0,
	scale: 0.8,
	y: 0,
	transition: props => tween({ ...props, duration: 300, ease: expoEaseIn })
};
const Spinner = posed.div({
	[ConfirmationViewState.CREATING_ROOM]: spinnerShow,
	[ConfirmationViewState.SUCCESSFUL]: spinnerHideSuccessful,
	[ConfirmationViewState.ERROR]: spinnerHideError
});

export default Spinner;
