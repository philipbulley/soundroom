import posed from 'react-pose';
import posedTimeline from '../../../shared/pose/posed-timeline';
import { ConfirmationViewState } from './confirmation-view-state';

const backHide = {
	opacity: 0,
	scale: 0.8
};
const backShow = posedTimeline([800, { to: { opacity: 1, scale: 1 } }]);
const Back = posed.div({
	[ConfirmationViewState.CREATING_ROOM]: backHide,
	[ConfirmationViewState.SUCCESSFUL]: backHide,
	[ConfirmationViewState.ERROR]: backShow
});

export default Back;
