import posed from 'react-pose';
import posedTimeline from '../../../shared/pose/posed-timeline';
import { ConfirmationViewState } from './confirmation-view-state';
import { expoEaseOut } from '../../../shared/pose/easing';
import { tween } from 'popmotion';

const tickShow = posedTimeline([
	300,
	{ to: { opacity: 1, y: 0 }, ease: expoEaseOut },
	1400,
	{ to: { opacity: 0, y: -20 }, ease: expoEaseOut }
]);
const tickHide = {
	opacity: 0,
	y: 20,
	transition: props => tween({ ...props, duration: 300, ease: expoEaseOut })
};
const Tick = posed.div({
	[ConfirmationViewState.CREATING_ROOM]: tickHide,
	[ConfirmationViewState.SUCCESSFUL]: tickShow,
	[ConfirmationViewState.ERROR]: tickHide
});

export default Tick;
