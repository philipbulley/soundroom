import * as React from 'react';
import { PlaylistCollection } from '../shared/store/playlist-collection/playlist-collection';
import { StoreState } from '../shared/store/store-state';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import RoomsStyled from './rooms.styled';
import { RoomCount } from './room-count/room-count';
import { PlaylistCollectionActions } from '../shared/store/playlist-collection/playlist-collection-action-types';
import { playlistCollectionLoadAction } from '../shared/store/playlist-collection/load/playlist-collection-load.action';
import Icon from '../shared/icon/icon';

type ConnectedProps = StateProps & DispatchProps & RouteComponentProps<{}>;

class Rooms extends React.Component<ConnectedProps> {
  componentDidMount() {
    this.props.loadPlaylistCollection();
  }

  render() {
    const {playlistCollection} = this.props;

    return (
      <RoomsStyled>
        <Helmet>
          <title>Soundroom: Join a room!</title>
        </Helmet>
        <h2>Join a room!</h2>
        {playlistCollection.loading &&
          <h3 className="loading">
            <Icon id="circle-o-notch" spin/> Loading rooms...
          </h3>
        }

        {!playlistCollection.loading &&
          <RoomCount playlistCollection={playlistCollection}/>
        }
      </RoomsStyled>
    );
  }
}

const mapStateToProps = ({playlistCollection}: StoreState) => ({
  playlistCollection,
});

const mapDispatchToProps = (dispatch: Dispatch<PlaylistCollectionActions>): DispatchProps => ({
  loadPlaylistCollection: () => dispatch(playlistCollectionLoadAction()),
});

interface StateProps {
  playlistCollection: PlaylistCollection;
}

interface DispatchProps {
  loadPlaylistCollection: () => {};
}

export default connect<StateProps, DispatchProps, RouteComponentProps<{}>>(mapStateToProps, mapDispatchToProps)(Rooms);
