import * as React from 'react';
import Icon from '../../../shared/icon/icon';
import styled from 'styled-components';
import { PlaylistCreate } from '../../../shared/store/playlists/playlists';
import {
	// TweenMax,
	TimelineLite,
	TimelineMax
	// Expo
} from 'gsap';
// import TweenConfig = gsap.TweenConfig;

import Button from '../../../shared/button/button';
import { ConfirmationViewState } from './confirmation-view-state';
import Back from './back';
import Cross from './cross';
import Tick from './tick';
import Spinner from './spinner';
import { Layer } from './confirmation.styled';

export class Confirmation extends React.Component<Props, State> {
	spinner: HTMLElement;
	tick: HTMLElement;
	cross: HTMLElement;
	backButton: HTMLElement;

	tl: TimelineLite = null;

	state = {
		viewState: null,
		viewStatePrev: null
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			viewState: this.getViewState(props.playlistCreate),
			viewStatePrev: null
		};
	}

	componentDidMount() {
		const viewState = this.getViewState(this.props.playlistCreate);

		this.transition(viewState, null);
	}

	componentDidUpdate(prevProps: Props) {
		const viewState = this.getViewState(this.props.playlistCreate);
		const viewStatePrev = prevProps.playlistCreate && this.getViewState(prevProps.playlistCreate);

		if (viewState !== viewStatePrev) {
			this.transition(viewState, viewStatePrev);
		}
	}

	componentWillReceiveProps(nextProps: Props) {
		this.setState({
			viewState: this.getViewState(nextProps.playlistCreate),
			viewStatePrev: this.props.playlistCreate && this.getViewState(this.props.playlistCreate)
		});
	}

	getViewState(playlistCreate: PlaylistCreate): ConfirmationViewState {
		/** awaitingCreation signifies we're loading, or just about to load */
		const awaitingCreation = playlistCreate.loading || (!playlistCreate.successfullyCreatedId && !playlistCreate.error);

		if (!awaitingCreation && playlistCreate.error) {
			return ConfirmationViewState.ERROR;
		} else if (!awaitingCreation && playlistCreate.successfullyCreatedId) {
			return ConfirmationViewState.SUCCESSFUL;
		}

		return ConfirmationViewState.CREATING_ROOM;
	}

	transition(viewState: ConfirmationViewState, viewStatePrev: ConfirmationViewState) {
		// const { onSuccessComplete } = this.props;

		if (this.tl) {
			this.tl.kill();
		}

		this.tl = new TimelineMax();

		// switch (viewStatePrev) {
		// 	// case ConfirmationViewState.CREATING_ROOM:
		// 	// 	this.tl.add(
		// 	// 		TweenMax.to(this.spinner, 0.4, {
		// 	// 			autoAlpha: 0,
		// 	// 			y: -20,
		// 	// 			ease: Expo.easeIn
		// 	// 		})
		// 	// 	);
		// 	// 	break;
		// 	case ConfirmationViewState.SUCCESSFUL:
		// 		this.tl.add(
		// 			TweenMax.to(this.tick, 0.4, { autoAlpha: 0, ease: Expo.easeOut })
		// 		);
		// 		break;
		// 	case ConfirmationViewState.ERROR:
		// 		this.tl.add(
		// 			TweenMax.to([this.cross, this.backButton], 0.4, {
		// 				autoAlpha: 0,
		// 				ease: Expo.easeOut
		// 			})
		// 		);
		// 		break;
		// }

		// switch (viewState) {
		// 	// case ConfirmationViewState.CREATING_ROOM:
		// 	// 	this.tl.add(
		// 	// 		TweenMax.fromTo(
		// 	// 			this.spinner,
		// 	// 			0.4,
		// 	// 			{ y: 0, scale: 0.8 },
		// 	// 			{ autoAlpha: 1, scale: 1, ease: Expo.easeOut }
		// 	// 		)
		// 	// 	);
		// 	// 	break;
		// 	case ConfirmationViewState.SUCCESSFUL:
		// 		const config: TweenConfig = { autoAlpha: 1, y: 0, ease: Expo.easeOut };
		// 		this.tl.add(TweenMax.fromTo(this.tick, 0.4, { y: 20 }, config));
		// 		this.tl.add(
		// 			TweenMax.to(this.tick, 0.6, {
		// 				y: -20,
		// 				autoAlpha: 0,
		// 				ease: Expo.easeIn,
		// 				onComplete: () => {
		// 					if (onSuccessComplete) {
		// 						onSuccessComplete();
		// 					}
		// 				}
		// 			}),
		// 			null,
		// 			null,
		// 			1.2
		// 		);
		// 		break;
		// 	case ConfirmationViewState.ERROR:
		// 		this.tl.add(
		// 			TweenMax.fromTo(
		// 				this.cross,
		// 				0.4,
		// 				{ scale: 0.8 },
		// 				{ autoAlpha: 1, scale: 1, y: 0, ease: Expo.easeOut }
		// 			)
		// 		);
		// 		this.tl.add(
		// 			TweenMax.fromTo(
		// 				this.backButton,
		// 				0.4,
		// 				{ scale: 0.8 },
		// 				{ autoAlpha: 1, scale: 1, y: 0, ease: Expo.easeOut }
		// 			)
		// 		);
		// 		break;
		// }
	}

	// TODO: TEst this works by creating a playlist!
	/**
	 * To be called when the success ConfirmationViewState.SUCCESSFUL animation has completed. The parent of this
	 * component can then proceed.
	 */
	onSuccessComplete = () => {
		const { onSuccessComplete } = this.props;
		const { viewState } = this.state;

		if (ConfirmationViewState.SUCCESSFUL === viewState && onSuccessComplete) {
			onSuccessComplete();
		}
	};

	render() {
		const { onGoBack } = this.props;
		const { viewState } = this.state;

		return (
			<ConfirmationStyled>
				<Layer>
					<Spinner pose={viewState}>
						<Icon id="circle-o-notch" size={3} spin />
					</Spinner>
				</Layer>

				<Layer>
					<Tick pose={viewState} onPoseComplete={this.onSuccessComplete}>
						<Icon id="check" size={3} />
					</Tick>
				</Layer>

				<Layer>
					<Cross pose={viewState}>
						<Icon id="close" size={3} />
					</Cross>
				</Layer>

				<Layer verticalOffset="10%">
					<Back pose={viewState}>
						<Button className={'button'} green onClick={onGoBack}>
							Try again
						</Button>
					</Back>
				</Layer>
			</ConfirmationStyled>
		);
	}
}

interface Props {
	playlistCreate: PlaylistCreate;
	onGoBack: () => void;
	onSuccessComplete?: () => void;
}

interface State {
	viewState: ConfirmationViewState;
	viewStatePrev: ConfirmationViewState;
}

const ConfirmationStyled = styled.div`
	position: relative;

	.message {
		position: absolute;
		margin-top: 10%;
		width: 100%;
	}
`;
