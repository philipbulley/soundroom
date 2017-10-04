import * as React from 'react';
import { PlaylistMenuItemStyled, CloseButton } from './playlist-menu-item.styled';
import Icon from '../shared/icon/icon';
import Button from '../shared/button/button';

const PlaylistMenuItem = ({name}) => (
  <PlaylistMenuItemStyled>
    <CloseButton noStyle>
      <Icon id="close"/>
    </CloseButton>
    <h3>{name}</h3>
    <Button>
      Join Room
    </Button>
  </PlaylistMenuItemStyled>
);

export default PlaylistMenuItem;
