import * as React from 'react';
import Icon from '../../shared/icon/icon';
import Button from '../../shared/button/button';
import styled from 'styled-components';
import { PlaylistCreate } from '../../shared/store/playlists/playlists';
import { TweenMax, TimelineLite, TimelineMax, Expo } from 'gsap';
import TweenConfig = gsap.TweenConfig;

export class Confirmation extends React.Component<Props, State> {
  spinner: HTMLElement;
  tick: HTMLElement;
  cross: HTMLElement;
  backButton: HTMLElement;

  tl: TimelineLite = null;

  state = {
    viewState: null,
    viewStatePrev: null,
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

  getViewState(playlistCreate: PlaylistCreate): ViewState {
    /** awaitingCreation signifies we're loading, or just about to load */
    const awaitingCreation = playlistCreate.loading ||
      (!playlistCreate.successfullyCreatedId && !playlistCreate.error);

    if (!awaitingCreation && playlistCreate.error) {
      return ViewState.ERROR;
    } else if (!awaitingCreation && playlistCreate.successfullyCreatedId) {
      return ViewState.SUCCESSFUL;
    }

    return ViewState.CREATING_ROOM;
  }

  transition(viewState: ViewState, viewStatePrev: ViewState) {
    const {onSuccessComplete} = this.props;

    if (this.tl) {
      this.tl.kill();
    }

    this.tl = new TimelineMax();

    switch (viewStatePrev) {
      case ViewState.CREATING_ROOM:
        this.tl.add(TweenMax.to(this.spinner, .4, {autoAlpha: 0, y: -20, ease: Expo.easeIn}));
        break;
      case ViewState.SUCCESSFUL:
        this.tl.add(TweenMax.to(this.tick, .4, {autoAlpha: 0, ease: Expo.easeOut}));
        break;
      case ViewState.ERROR:
        this.tl.add(TweenMax.to([this.cross, this.backButton], .4, {autoAlpha: 0, ease: Expo.easeOut}));
        break;
    }

    switch (viewState) {
      case ViewState.CREATING_ROOM:
        this.tl.add(TweenMax.fromTo(this.spinner, .4, {y: 0, scale: .8}, {autoAlpha: 1, scale: 1, ease: Expo.easeOut}));
        break;
      case ViewState.SUCCESSFUL:
        const config: TweenConfig = {autoAlpha: 1, y: 0, ease: Expo.easeOut};
        this.tl.add(TweenMax.fromTo(this.tick, .4, {y: 20}, config));
        this.tl.add(TweenMax.to(this.tick, .6, {
          y: -20, autoAlpha: 0, ease: Expo.easeIn, onComplete: () => {
            if (onSuccessComplete) {
              onSuccessComplete();
            }
          }
        }), null, null, 1.2);
        break;
      case ViewState.ERROR:
        this.tl.add(TweenMax.fromTo(this.cross, .4, {scale: .8}, {autoAlpha: 1, scale: 1, y: 0, ease: Expo.easeOut}));
        this.tl.add(
          TweenMax.fromTo(this.backButton, .4, {scale: .8}, {autoAlpha: 1, scale: 1, y: 0, ease: Expo.easeOut}));
        break;
    }
  }

  render() {
    const {onGoBack} = this.props;

    return (
      <ConfirmationStyled className="debug--confirmation-styled">
        <Layer innerRef={ref => this.spinner = ref}>
          <Icon id="circle-o-notch" size={3} spin/>
        </Layer>

        <Layer innerRef={ref => this.tick = ref}>
          <Icon id="check" size={3}/>
        </Layer>

        <Layer innerRef={ref => this.cross = ref} verticalOffset="-10%">
          <Icon id="close" size={3}/>
        </Layer>

        <Layer innerRef={ref => this.backButton = ref} verticalOffset="10%">
          <Button className={'button'} green onClick={onGoBack}>Try again</Button>
        </Layer>
      </ConfirmationStyled>
    );
  }
}

enum ViewState {
  CREATING_ROOM = 'CREATING_ROOM',
  SUCCESSFUL = 'SUCCESSFUL',
  ERROR = 'ERROR'
}

interface Props {
  playlistCreate: PlaylistCreate;
  onGoBack: () => void;
  onSuccessComplete?: () => void;
}

interface State {
  viewState: ViewState;
  viewStatePrev: ViewState;
}

const ConfirmationStyled = styled.div`
  position: relative;
  
  .message {
    position: absolute;
    margin-top: 10%;
    width: 100%;
  }
`;

interface LayerProps {
  verticalOffset?: string;
}

const Layer = styled.div`
  position: absolute;
  display: block;
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  margin-top: ${({verticalOffset}: LayerProps) => verticalOffset || 0}
`;
