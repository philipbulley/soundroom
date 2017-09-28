import * as React from 'react';
import { PlaylistCollection } from '../shared/store/playlist-collection/playlist-collection';
import { StoreState } from '../shared/store/store-state';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import RoomsStyled from './rooms.styled';
import { RoomCount } from './room-count/room-count';

const Rooms = ({playlistCollection}: StateProps & RouteComponentProps<{}>) => (
  <RoomsStyled>
    <Helmet>
      <title>Soundroom: Join a room!</title>
    </Helmet>
    <h2>Join a room!</h2>
    <RoomCount playlistCollection={playlistCollection}/>
  </RoomsStyled>
);

interface StateProps {
  playlistCollection: PlaylistCollection;
}

const mapStateToProps = ({playlistCollection}: StoreState) => ({
  playlistCollection,
});

export default connect<StateProps, void, RouteComponentProps<{}>>(mapStateToProps)(Rooms);

// Example of connected component:
// https://github.com/supasate/connected-react-router/blob/master/examples/typescript/src/components/Counter.tsx
