import * as React from 'react';
import { PlaylistCollection, PlaylistCollectionItem } from '../shared/store/playlist-collection/playlist-collection';
import { StoreState } from '../shared/store/store-state';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import PlaylistCount from './playlist-count';
import { PlaylistCollectionActions } from '../shared/store/playlist-collection/playlist-collection-action-type';
import { playlistCollectionLoadAction } from '../shared/store/playlist-collection/load/playlist-collection-load.action';
import Icon from '../shared/icon/icon';
import PlaylistMenuItem from './playlist-menu-item/playlist-menu-item';
import styled from 'styled-components';
import { contentContainer } from '../shared/layout/content-container';
import { PlaylistMenuLi, PlaylistMenuUl } from './playlist-menu-list';
import PlaylistCreate from './playlist-create/playlist-create';

type ConnectedProps = StateProps & DispatchProps & RouteComponentProps<{}> & PassedProps;

class PlaylistMenu extends React.Component<ConnectedProps> {
  componentDidMount() {
    this.props.loadPlaylistCollection();
  }

  render() {
    const {playlistCollection, className} = this.props;

    return (
      <div className={className}>
        <Helmet>
          <title>Soundroom: Join a room!</title>
        </Helmet>
        <h2>Join a room!</h2>
        {playlistCollection.loading &&
        <h3 className="loading">
          <Icon id="circle-o-notch" spin/> Loading rooms...
        </h3>
        }

        {!playlistCollection.loading && <div>
          <PlaylistMenuUl>
            {playlistCollection.items.map((item: PlaylistCollectionItem, i) => (
                <PlaylistMenuLi key={i}>
                  <PlaylistMenuItem name={item.name}/>
                </PlaylistMenuLi>
              )
            )}
            <PlaylistMenuLi key={'create'}>
              <PlaylistCreate/>
            </PlaylistMenuLi>
          </PlaylistMenuUl>

          <PlaylistCount playlistCollection={playlistCollection}/>
        </div>
        }
      </div>
    );
  }
}

const PlaylistMenuStyled = styled(PlaylistMenu)`
  ${contentContainer}
  
  h2 {
    text-align: center;
  }
  
  .loading {
    text-align: center;
  }
`;

const mapStateToProps = ({playlistCollection}: StoreState) => ({
  playlistCollection,
});

const mapDispatchToProps = (dispatch: Dispatch<PlaylistCollectionActions>): DispatchProps => ({
  loadPlaylistCollection: () => dispatch(playlistCollectionLoadAction()),
});

interface PassedProps {
  className?: string;
}

interface StateProps {
  playlistCollection: PlaylistCollection;
}

interface DispatchProps {
  loadPlaylistCollection: () => {};
}

export default connect<StateProps,
  DispatchProps,
  RouteComponentProps<{}>>(mapStateToProps, mapDispatchToProps)(PlaylistMenuStyled);
