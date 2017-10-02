import * as React from 'react';
import { PlaylistCountStyled } from './playlist-count.styled';
import { PlaylistCollection } from '../../shared/store/playlist-collection/playlist-collection';

export const PlaylistCount = ({playlistCollection}: Props) => (
  <PlaylistCountStyled>
    {!!playlistCollection.items.length
    && <span>You have {playlistCollection.items.length} rooms to choose from, or create your own!</span>}

    {!!playlistCollection.items.length
    || <span>There are no rooms available. Why not start by creating your own!</span>}
  </PlaylistCountStyled>
);

interface Props {
  playlistCollection: PlaylistCollection;
}
