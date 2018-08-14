import posed from 'react-pose';
import posedTimeline from '../../../shared/pose/posed-timeline';
import { ConfirmationViewState } from './confirmation-view-state';
import { expoEaseOut } from '../../../shared/pose/easing';

const crossHide = {
	opacity: 0,
	scale: 0.8,
	y: 0
};
const crossShow = posedTimeline([
	500,
	{ to: { opacity: 1, scale: 1 }, ease: expoEaseOut },
	500 + 300,
	{ to: { y: -20 } }
]);
const Cross = posed.div({
	[ConfirmationViewState.CREATING_ROOM]: crossHide,
	[ConfirmationViewState.SUCCESSFUL]: crossHide,
	[ConfirmationViewState.ERROR]: crossShow
});

export default Cross;
