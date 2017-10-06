import * as React from 'react';
import styled from 'styled-components';
import Icon from '../../shared/icon/icon';
import colors from '../../shared/colors/colors';
import PlaylistMenuItemCloseButton from './playlist-menu-item-close-button';
import Button from '../../shared/button/button';

const PlaylistMenuItem: React.StatelessComponent<PlaylistMenuItemProps> = ({name, className}) => (
  <div className={className}>
    <PlaylistMenuItemCloseButton noStyle>
      <Icon id="close"/>
    </PlaylistMenuItemCloseButton>

    <h3>{name}</h3>

    <Button>
      Join Room
    </Button>
  </div>
);

interface PlaylistMenuItemProps {
  name: string;
  className?: string;
}

export default styled(PlaylistMenuItem)`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 30px;
  text-align: center;
  background-color: ${colors.white};
`;
