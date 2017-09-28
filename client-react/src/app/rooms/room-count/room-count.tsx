import * as React from 'react';
import RoomCountStyled from './room-count.styled';
import { PlaylistCollection } from '../../shared/store/playlist-collection/playlist-collection';

export const RoomCount = ({playlistCollection}: Props) => (
  <RoomCountStyled>
    {!!playlistCollection.playlists.length
    && <span>You have {playlistCollection.playlists.length} rooms to choose from, or create your own!</span>}

    {!!playlistCollection.playlists.length
    || <span>There are no rooms available. Why not start by creating your own!</span>}
  </RoomCountStyled>
);

interface Props {
  playlistCollection: PlaylistCollection;
}
