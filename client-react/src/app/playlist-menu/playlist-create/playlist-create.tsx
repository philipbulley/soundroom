import * as React from 'react';
import styled from 'styled-components';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../../shared/store/store-state';
import {
  playlistCreateAction,
  PlaylistCreateParams
} from '../../shared/store/playlists/create/playlist-create.action';
import colors from '../../shared/colors/colors';
import Button from '../../shared/button/button';
import Input from '../../shared/input/input';
import { TweenMax, Expo } from 'gsap';
import Icon from '../../shared/icon/icon';
import { PlaylistsActions } from '../../shared/store/playlists/playlists-action-type';

type Props = StateProps & DispatchProps & PassedProps;

class PlaylistCreate extends React.Component<Props, State> {

  nameInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;

  state: State = {
    step: 0,
    stepsTotal: 4,
    name: '',
    description: '',
  };

  goToNextStep = () => {
    // TODO: Validate data in current step before moving to next...
    this.setState({step: this.state.step + 1}, this.tweenToStep);
  }

  goToPreviousStep = () => {
    this.setState({step: this.state.step - 1}, this.tweenToStep);
  }

  tweenToStep = () => {
    TweenMax.to(this.state.steps!, .5, {
      x: `${(-100 / this.state.stepsTotal) * this.state.step}%`,
      ease: Expo.easeOut,
      onComplete: this.handleStepTweenComplete
    });
  }

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
  }

  handleInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleKeyPress = event => {
    if (event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      this.goToPreviousStep();
    } else if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      this.goToNextStep();
    }
  }

  submit() {
    const {name, description} = this.state;

    this.props.create({name, description});
  }

  render() {
    const {className} = this.props;
    const {stepsTotal} = this.state;
    // const TOTAL_STEPS = 2;

    return (
      <div className={className}>
        <Steps stepsTotal={stepsTotal} innerRef={el => this.state.steps = el}>
          <Step num={0}>
            <Button green onClick={this.goToNextStep}>Create a room +</Button>
          </Step>
          <Step num={1}>
            <h3>Name your room</h3>
            <Input type="text"
                   innerRef={el => this.nameInput = el}
                   value={this.state.name}
                   name="name"
                   onChange={this.handleInputChange}
                   onKeyDown={this.handleKeyPress}
            />
            <div>
              <Button green onClick={this.goToNextStep}>Next</Button>
            </div>
          </Step>
          <Step num={2}>
            <h3>What's it all about?</h3>
            <Input type="text"
                   innerRef={el => this.descriptionInput = el}
                   value={this.state.description}
                   name="description"
                   onChange={this.handleInputChange}
                   onKeyDown={this.handleKeyPress}
            />
            <ButtonContainer>
              <Button green onClick={this.goToPreviousStep}><Icon id="arrow-left" /></Button>
              <Button green onClick={this.goToNextStep}>Next</Button>
            </ButtonContainer>
          </Step>
          <Step num={3}>
            <Icon id="circle-o-notch" spin />
            TODO: Check state to determine whether we're loading, displaying success or an error.
            Loading: "Creating room"
            Success: Redirect to room
            Error: Button to go back to step 1
          </Step>
        </Steps>
      </div>
    );
  }
}

interface State {
  step: number;
  stepsTotal: number;
  nameInput?: HTMLInputElement;
  descriptionInput?: HTMLInputElement;
  steps?: HTMLDivElement;
  name: string;
  description: string;
}

interface PassedProps {
  className?: string;
}

interface StateProps {

}

interface DispatchProps {
  create: (createParams: PlaylistCreateParams) => {};
}

const PlaylistCreateStyled = styled(PlaylistCreate)`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  background-color: ${colors.green};
`;

const Steps = styled.div`
  display: flex;
  width: ${({stepsTotal}: StepsProps) => stepsTotal * 100}%;
  height: 100%;
`;

interface StepsProps {
  stepsTotal: number;
}

interface StepProps {
  num: number;
}

const Step = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: center;
  width: 100%;
  padding: 30px;
  color: ${colors.white};
  
  // justify-content: ${({num}: StepProps) => num === 0 ? 'center' : 'flex-start'}
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const mapStateToProps = (state: StoreState) => ({});

const mapDispatchToProps = (dispatch: Dispatch<PlaylistsActions>): DispatchProps => ({
  create: (createParams: PlaylistCreateParams) => dispatch(playlistCreateAction(createParams)),
});

export default connect<StateProps,
  DispatchProps,
  PassedProps>(mapStateToProps, mapDispatchToProps)(PlaylistCreateStyled);
