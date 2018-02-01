import * as React from 'react';
import styled from 'styled-components';
import Icon from '../../shared/icon/icon';
import colors from '../../shared/colors/colors';
import PlaylistMenuItemCloseButton from './playlist-menu-item-close-button';
import { Link } from 'react-router-dom';
import { Playlist } from '../../shared/model/playlist';
import Button from '../../shared/button/button';

const PlaylistMenuItem: React.StatelessComponent<PlaylistMenuItemProps> = ({playlist, className}) => (
  <div className={className}>
    <PlaylistMenuItemCloseButton noStyle>
      <Icon id="close"/>
    </PlaylistMenuItemCloseButton>

    <h3>{playlist.name}</h3>

    <Link to={'/room/' + playlist._id}>
      <Button>Join Room</Button>
    </Link>
  </div>
);

interface PlaylistMenuItemProps {
  playlist: Playlist;
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
