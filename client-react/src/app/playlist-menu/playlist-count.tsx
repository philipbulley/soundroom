import * as React from 'react';
import { Playlists } from '../shared/store/playlists/playlists';
import styled from 'styled-components';
import colors from '../shared/colors/colors';

const PlaylistCount = ({playlists, className}: Props) => (
  <div className={className}>
    {!!playlists.items.length
    && <span>You have {playlists.items.length} rooms to choose from, or create your own!</span>}

    {!!playlists.items.length
    || <span>There are no rooms available. Why not start by creating your own!</span>}
  </div>
);

interface Props {
  playlists: Playlists;
  className?: string;
}

export default styled(PlaylistCount)`
  color: ${colors.greyGrit};
  text-align: center;
`;
