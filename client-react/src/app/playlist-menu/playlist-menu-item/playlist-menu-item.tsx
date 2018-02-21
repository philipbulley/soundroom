import * as React from 'react';
import { ComponentClass } from 'react';
import styled from 'styled-components';
import Icon from '../../shared/icon/icon';
import colors from '../../shared/colors/colors';
import PlaylistMenuItemCloseButton from './playlist-menu-item-close-button';
import { Link } from 'react-router-dom';
import { Playlist } from '../../shared/model/playlist';
import Button from '../../shared/button/button';
import { TweenMax, Back } from 'gsap';
import { Transition } from 'react-transition-group';

class PlaylistMenuItem extends React.Component<PlaylistMenuItemProps> {

  name: HTMLHeadingElement;

  doTransition = (node, done) => {
    const {in: inProp, playlist} = this.props;

    console.log('PlaylistMenuItem.doTransition():', playlist.name, inProp ? 'IN' : 'OUT');

    if (inProp) {
      TweenMax.fromTo(this.name, 1, {y: 50, opacity: 0}, {
        y: 0, opacity: 1,
        ease: Back.easeOut,
        onComplete: () => {
          console.log('About to call done():', playlist.name);
          done();
        }
      });
    } else {
      TweenMax.to(this.name, 0.5, {
        scale: 0.5,
        ease: Back.easeIn,
        onComplete: () => {
          console.log('About to call done():', playlist.name);
          done();
        }
      });
    }
  };

  render() {
    const {playlist, className, in: inProp, component} = this.props;

    const WrapperComponent = component || 'div';

    return (
      <Transition
        in={inProp}
        addEndListener={this.doTransition}
        onEntered={() => console.log('PlaylistMenuItem onEntered:', playlist.name)}
        onExited={() => console.log('PlaylistMenuItem onExited:', playlist.name)}
        unmountOnExit={true}
        component={component}
      >
        <WrapperComponent>
          <Host className={className}>
            <PlaylistMenuItemCloseButton noStyle>
              <Icon id="close"/>
            </PlaylistMenuItemCloseButton>

            <h3 className="name" ref={node => this.name = node}>{playlist.name}</h3>

            <Link className="button" to={'/room/' + playlist._id}>
              <Button>Join Room</Button>
            </Link>
          </Host>
        </WrapperComponent>
      </Transition>
    );
  }
}

interface PlaylistMenuItemProps {
  playlist: Playlist;
  className?: string;
  index: number;
  component: string | ComponentClass;
  in?: boolean;
}

const Host = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 30px;
  text-align: center;
  background-color: ${colors.white};
`;
Host.displayName = 'Host';

export default PlaylistMenuItem;
