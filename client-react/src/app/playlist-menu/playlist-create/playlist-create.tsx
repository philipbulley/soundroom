import * as React from 'react';
import styled from 'styled-components';
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../../shared/store/store-state';
import { PlaylistActions } from '../../shared/store/playlist/playlist-action-types';
import { playlistCreateAction, PlaylistCreateParams } from '../../shared/store/playlist/create/playlist-create.action';
import colors from '../../shared/colors/colors';
import Button from '../../shared/button/button';
// import { timingFunctions } from 'polished';
import Input from '../../shared/input/input';
import { TweenMax, Expo } from 'gsap';

type Props = StateProps & DispatchProps & PassedProps;

class PlaylistCreate extends React.Component<Props, State> {
  state: State = {
    step: 0,
  };

  goToNextStep = () => {
    this.setState({
      step: this.state.step + 1,
    }, () => {
      TweenMax.to(this.state.steps!, .5, {
        // x: 100,
          x: `${(-100 / 2) * this.state.step}%`,
          ease: Expo.easeOut,
          // TODO: focus should check value of this.state.step to determine which element to focus
          onComplete: () => this.state.roomName!.focus()
      });
    });
  };

  render() {
    const {className, create} = this.props;
    // const {step} = this.state;
    // const TOTAL_STEPS = 2;

    return (
      <div className={className} onClick={() => create({name: 'foo', description: 'bar'})}>
        {/*<Steps step={step} totalSteps={TOTAL_STEPS} innerRef={el => this.state.steps}>*/}
        <Steps innerRef={el => this.state.steps = el}>
          <Step num={0}>
            <Button green onClick={this.goToNextStep}>Create a room +</Button>
          </Step>
          <Step num={1}>
            <h3>Name your room</h3>
            <Input type="text" innerRef={el => this.state.roomName = el}/>
            <div>
              <Button green onClick={this.goToNextStep}>Next</Button>
            </div>
          </Step>
        </Steps>
      </div>
    );
  }
}

interface State {
  step: number;
  roomName?: HTMLInputElement;
  steps?: HTMLDivElement;
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
  text-align: left;
`;

const Steps = styled.div`
  display: flex;
  width: 200%;
  height: 100%;
`;

// interface StepsProps {
//   step: number;
//   totalSteps: number;
// }

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
  justify-content: 'center';
`;

const mapStateToProps = (state: StoreState) => ({});

const mapDispatchToProps = (dispatch: Dispatch<PlaylistActions>): DispatchProps => ({
  create: (createParams: PlaylistCreateParams) => dispatch(playlistCreateAction(createParams)),
});

export default connect<StateProps,
  DispatchProps,
  PassedProps>(mapStateToProps, mapDispatchToProps)(PlaylistCreateStyled);
