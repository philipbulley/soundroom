import * as React from 'react';
import { PlaylistMenuItemStyled } from './playlist-menu-item.styled';
import Button from '../shared/button/button';

const PlaylistMenuItem = ({name}) => (
  <PlaylistMenuItemStyled>
    <h3>{name}</h3>
    <Button>
      Join Room
    </Button>
  </PlaylistMenuItemStyled>
);

export default PlaylistMenuItem;
