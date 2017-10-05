import * as React from 'react';
import { PlaylistCollection } from '../shared/store/playlist-collection/playlist-collection';
import styled from 'styled-components';
import colors from '../shared/colors/colors';

const PlaylistCount = ({playlistCollection, className}: Props) => (
  <div className={className}>
    {!!playlistCollection.items.length
    && <span>You have {playlistCollection.items.length} rooms to choose from, or create your own!</span>}

    {!!playlistCollection.items.length
    || <span>There are no rooms available. Why not start by creating your own!</span>}
  </div>
);

interface Props {
  playlistCollection: PlaylistCollection;
  className?: string;
}

export default styled(PlaylistCount)`
  color: ${colors.greyGrit};
  text-align: center;
`;
