import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../../shared/store/store-state';
import {
	playlistCreateAction,
	PlaylistCreateParams
} from '../../shared/store/playlists/playlist-create/playlist-create.action';
import Button from '../../shared/button/button';
import Input from '../../shared/input/input';
import Icon from '../../shared/icon/icon';
import { PlaylistsActions } from '../../shared/store/playlists/playlists-action-type';
import { Playlists } from '../../shared/store/playlists/playlists';
import PlaylistCreateStyled, {
	Steps,
	Step,
	ButtonContainer,
	PaddedButton,
	PlaylistCreateContainer
} from './playlist-create.styled';
import { Confirmation } from './confirmation/confirmation';
import { playlistCreateResetAction } from '../../shared/store/playlists/playlist-create-reset/playlist-create-reset.action';
import { playlistCreateTryAgainAction } from '../../shared/store/playlists/playlist-create-try-again/playlist-create-try-again.action';

type Props = StateProps & DispatchProps & PassedProps;

class PlaylistCreate extends React.Component<Props, State> {
	nameInput: HTMLInputElement;
	descriptionInput: HTMLInputElement;
	steps?: HTMLDivElement;

	defaultState: State = {
		step: 0,
		stepsTotal: 4,
		name: '',
		description: '',
		reset: false
	};

	state: State = this.defaultState;

	goToNextStep = () => {
		if (this.isStepValid(this.state.step)) {
			this.goToStep(this.state.step + 1);
		}
	};

	goToPreviousStep = () => {
		this.goToStep(this.state.step - 1);
	};

	goToStep = (step: number) => {
		this.setState({
			step
		});
	};

	goToStepOne = () => {
		this.goToStep(1);
	};

	handleStepTweenComplete = () => {
		switch (this.state.step) {
			case 1:
				this.nameInput!.focus();
				break;
			case 2:
				this.descriptionInput!.focus();
				break;
			case 3:
				this.submit();
				break;
			default:
		}
	};

	handleInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleKeyPress = event => {
		if (event.shiftKey && event.key === 'Tab') {
			event.preventDefault();
			this.goToPreviousStep();
		} else if (event.key === 'Enter' || event.key === 'Tab') {
			event.preventDefault();
			this.goToNextStep();
		}
	};

	submit() {
		const { name, description } = this.state;
		this.props.onCreate({ name, description });
	}

	isStepValid(step: number) {
		switch (step) {
			case 0:
				return true;
			case 1:
				return this.state.name.length > 1;
			case 2:
				return this.state.description.length > 2;
			default:
				throw new Error(`Validation for step ${step} not implemented`);
		}
	}

	handleConfirmationSuccess = () => {
		this.setState({ reset: true });
	};

	handlePoseComplete = () => {
		if (this.state.reset) {
			this.props.onReset();
		}
	};

	tryAgain = () => {
		this.goToStepOne();

		this.props.onTryAgain();
	};

	setNameInputRef = ref => (this.nameInput = ref);
	setDescriptionInputRef = ref => (this.descriptionInput = ref);

	render() {
		const { className, playlists } = this.props;
		const { step, stepsTotal, name, description, reset } = this.state;

		return (
			<PlaylistCreateContainer className={className}>
				<PlaylistCreateStyled
					pose={reset ? 'reset' : 'visible'}
					initialPose={'init'}
					onPoseComplete={this.handlePoseComplete}
				>
					<Steps
						step={step}
						stepsTotal={stepsTotal}
						pose={`step${step % 2}`}
						onPoseComplete={this.handleStepTweenComplete}
					>
						<Step num={0}>
							<Button green onClick={this.goToNextStep}>
								Create a room +
							</Button>
						</Step>
						<Step num={1}>
							<h3>Name your room</h3>
							<Input
								type="text"
								innerRef={this.setNameInputRef}
								value={name}
								name="name"
								onChange={this.handleInputChange}
								onKeyDown={this.handleKeyPress}
							/>
							<ButtonContainer>
								<div>
									<PaddedButton noStyle onClick={this.goToNextStep} disabled={!this.isStepValid(1)}>
										<Icon id="arrow-right" size={2} />
									</PaddedButton>
								</div>
							</ButtonContainer>
						</Step>
						<Step num={2}>
							<h3>What's it all about?</h3>
							<Input
								type="text"
								innerRef={this.setDescriptionInputRef}
								value={description}
								name="description"
								onChange={this.handleInputChange}
								onKeyDown={this.handleKeyPress}
							/>
							<ButtonContainer>
								<div>
									<PaddedButton noStyle onClick={this.goToPreviousStep}>
										<Icon id="arrow-left" size={2} />
									</PaddedButton>
								</div>
								<div>
									<PaddedButton noStyle onClick={this.goToNextStep} disabled={!this.isStepValid(2)}>
										<Icon id="arrow-right" size={2} />
									</PaddedButton>
								</div>
							</ButtonContainer>
						</Step>
						<Step num={3}>
							<Confirmation
								playlistCreate={playlists.playlistCreate}
								onGoBack={this.tryAgain}
								onSuccess={this.handleConfirmationSuccess}
							/>
						</Step>
					</Steps>
				</PlaylistCreateStyled>
			</PlaylistCreateContainer>
		);
	}
}

interface State {
	step: number;
	stepsTotal: number;
	nameInput?: HTMLInputElement;
	descriptionInput?: HTMLInputElement;
	name: string;
	description: string;
	reset: boolean;
}

interface PassedProps {
	className?: string;
}

interface StateProps {
	playlists: Playlists;
}

interface DispatchProps {
	onCreate: (createParams: PlaylistCreateParams) => {};
	onReset: () => {};
	onTryAgain: () => {};
}

const mapStateToProps = (state: StoreState) => ({
	playlists: state.playlists
});

const mapDispatchToProps = (dispatch: Dispatch<PlaylistsActions>): DispatchProps => ({
	onCreate: (createParams: PlaylistCreateParams) => dispatch(playlistCreateAction(createParams)),
	onReset: () => dispatch(playlistCreateResetAction()),
	onTryAgain: () => dispatch(playlistCreateTryAgainAction())
});

export default connect<StateProps, DispatchProps, PassedProps>(mapStateToProps, mapDispatchToProps)(PlaylistCreate);
