import * as React from 'react';
import Icon from '../../../shared/icon/icon';
import styled from 'styled-components';
import { PlaylistCreate } from '../../../shared/store/playlists/playlists';
import Button from '../../../shared/button/button';
import { ConfirmationViewState } from './confirmation-view-state';
import Back from './back';
import Cross from './cross';
import Tick from './tick';
import Spinner from './spinner';
import { Layer } from './confirmation.styled';

export class Confirmation extends React.Component<Props, State> {
	state = {
		viewState: null,
		viewStatePrev: null
	};

	static deriveViewState(playlistCreate: PlaylistCreate): ConfirmationViewState {
		/** awaitingCreation signifies we're loading, or just about to load */
		const awaitingCreation = playlistCreate.loading || (!playlistCreate.successfullyCreatedId && !playlistCreate.error);

		if (!awaitingCreation && playlistCreate.error) {
			return ConfirmationViewState.ERROR;
		} else if (!awaitingCreation && playlistCreate.successfullyCreatedId) {
			return ConfirmationViewState.SUCCESSFUL;
		}

		return ConfirmationViewState.CREATING_ROOM;
	}

	constructor(props: Props) {
		super(props);

		this.state = {
			viewState: Confirmation.deriveViewState(props.playlistCreate),
			viewStatePrev: null
		};
	}

	componentWillReceiveProps(nextProps: Props) {
		this.setState({
			viewState: Confirmation.deriveViewState(nextProps.playlistCreate),
			viewStatePrev: this.props.playlistCreate && Confirmation.deriveViewState(this.props.playlistCreate)
		});
	}

	/**
	 * To be called when the success ConfirmationViewState.SUCCESSFUL animation has completed. The parent of this
	 * component can then proceed.
	 */
	onSuccessComplete = () => {
		if (ConfirmationViewState.SUCCESSFUL === this.state.viewState && this.props.onSuccessComplete) {
			this.props.onSuccessComplete();
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
