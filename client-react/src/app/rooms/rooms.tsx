import * as React from 'react';
import { PlaylistCollection } from '../shared/store/playlist-collection/playlist-collection';
import { StoreState } from '../shared/store/store-state';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

const Rooms = ({playlistCollection}: StateProps & RouteComponentProps<any>) => (
  <div>
    <h2>Join a room!</h2>
    There are {playlistCollection.playlists.length} rooms.
  </div>
);

interface StateProps {
  playlistCollection: PlaylistCollection;
}

const mapStateToProps = ({playlistCollection}: StoreState) => ({
  playlistCollection,
});

export default connect<StateProps, void, RouteComponentProps<any>>(mapStateToProps)(Rooms);

// Example of connected component:
// https://github.com/supasate/connected-react-router/blob/master/examples/typescript/src/components/Counter.tsx
