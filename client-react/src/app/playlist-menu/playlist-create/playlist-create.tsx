import * as React from 'react';
import styled from 'styled-components';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../../shared/store/store-state';
import {
  playlistCreateAction,
  PlaylistCreateParams
} from '../../shared/store/playlists/playlist-create/playlist-create.action';
import colors from '../../shared/colors/colors';
import Button from '../../shared/button/button';
import Input from '../../shared/input/input';
import { TweenMax, Expo } from 'gsap';
import Icon from '../../shared/icon/icon';
import { PlaylistsActions } from '../../shared/store/playlists/playlists-action-type';
import { Playlists } from '../../shared/store/playlists/playlists';
import { Link } from 'react-router-dom';

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
    if (this.isStepValid(this.state.step)) {
      this.goToStep(this.state.step + 1);
    }
  };

  goToPreviousStep = () => {
    this.goToStep(this.state.step - 1);
  };

  goToStep = (step: number) => {
    this.setState({step}, this.tweenToStep);
  };

  tweenToStep = () => {
    TweenMax.to(this.state.steps!, .5, {
      x: `${(-100 / this.state.stepsTotal) * this.state.step}%`,
      ease: Expo.easeOut,
      onComplete: this.handleStepTweenComplete
    });
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
    const {name, description} = this.state;

    this.props.create({name, description});
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

  render() {
    const {className, playlists} = this.props;
    const {stepsTotal, name, description} = this.state;
    const awaitingCreation = playlists.playlistCreate.loading ||
      (!playlists.playlistCreate.successfullyCreatedId && !playlists.playlistCreate.error);

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
                   value={name}
                   name="name"
                   onChange={this.handleInputChange}
                   onKeyDown={this.handleKeyPress}
            />
            <ButtonContainer>
              <div>
                <PaddedButton noStyle onClick={this.goToNextStep} disabled={!this.isStepValid(1)}>
                  <Icon id="arrow-right" size={2}/>
                </PaddedButton>
              </div>
            </ButtonContainer>
          </Step>
          <Step num={2}>
            <h3>What's it all about?</h3>
            <Input type="text"
                   innerRef={el => this.descriptionInput = el}
                   value={description}
                   name="description"
                   onChange={this.handleInputChange}
                   onKeyDown={this.handleKeyPress}
            />
            <ButtonContainer>
              <div>
                <PaddedButton noStyle onClick={this.goToPreviousStep}>
                  <Icon id="arrow-left" size={2}/>
                </PaddedButton>
              </div>
              <div>
                <PaddedButton noStyle onClick={this.goToNextStep} disabled={!this.isStepValid(2)}>
                  <Icon id="arrow-right" size={2}/>
                </PaddedButton>
              </div>
            </ButtonContainer>
          </Step>
          <Step num={3}>
            {awaitingCreation &&
            <Confirmation>
              <Icon id="circle-o-notch" size={3} className="icon" spin/>
              Creating room...
            </Confirmation>}

            {!awaitingCreation && !playlists.error &&
            <Confirmation>
              <Icon id="check" size={3} className="icon"/>
              <Link to={'/room/' + playlists.playlistCreate.successfullyCreatedId} title={'Join ' + name}>
                <Button green>Join Room</Button>
              </Link>
            </Confirmation>}

            {!awaitingCreation && playlists.error &&
            <Confirmation>
              <Icon id="close" size={3} className="icon"/>
              There were problems with creating your playlist.
              <Button green onClick={() => this.goToStep(1)}>Back</Button>
            </Confirmation>}
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
  playlists: Playlists;
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
  
  > * {
    flex: 1 1 auto;
  }
`;

const Confirmation = styled.div`
  .icon {
    display: block;
    margin-bottom: 30px;
  }
  
  .button {
    display: block;
    margin: 30px auto 0 auto;
  }
`;

const PaddedButton = Button.extend`
  padding: 14px;
`;

const mapStateToProps = (state: StoreState) => ({
  playlists: state.playlists
});

const mapDispatchToProps = (dispatch: Dispatch<PlaylistsActions>): DispatchProps => ({
  create: (createParams: PlaylistCreateParams) => dispatch(playlistCreateAction(createParams)),
});

export default connect<StateProps,
  DispatchProps,
  PassedProps>(mapStateToProps, mapDispatchToProps)(PlaylistCreateStyled);
