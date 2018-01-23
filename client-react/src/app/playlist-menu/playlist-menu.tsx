import * as React from 'react';
import { Playlists } from '../shared/store/playlists/playlists';
import { StoreState } from '../shared/store/store-state';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import PlaylistCount from './playlist-count';
import { PlaylistsActions } from '../shared/store/playlists/playlists-action-type';
import { playlistsLoadAction } from '../shared/store/playlists/load/playlists-load.action';
import Icon from '../shared/icon/icon';
import PlaylistMenuItem from './playlist-menu-item/playlist-menu-item';
import styled from 'styled-components';
import { contentContainer } from '../shared/layout/content-container';
import { PlaylistMenuLi, PlaylistMenuUl } from './playlist-menu-list';
import PlaylistCreate from './playlist-create/playlist-create';
import { Playlist } from '../shared/model/playlist';

type ConnectedProps = StateProps & DispatchProps & RouteComponentProps<{}> & PassedProps;

class PlaylistMenu extends React.Component<ConnectedProps> {
  componentDidMount() {
    this.props.loadPlaylists();
  }

  render() {
    const {playlists, className} = this.props;

    return (
      <div className={className}>
        <Helmet>
          <title>Soundroom: Join a room!</title>
        </Helmet>
        <h2>Join a room!</h2>
        {playlists.loading &&
        <h3 className="loading">
          <Icon id="circle-o-notch" spin/> Loading rooms...
        </h3>
        }

        {!playlists.loading && <div>
          <PlaylistMenuUl>
            {playlists.items.map((item: Playlist, i) => (
                <PlaylistMenuLi key={i}>
                  <PlaylistMenuItem name={item.name}/>
                </PlaylistMenuLi>
              )
            )}
            <PlaylistMenuLi key={'create'}>
              <PlaylistCreate/>
            </PlaylistMenuLi>
          </PlaylistMenuUl>

          <PlaylistCount playlists={playlists}/>
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

const mapStateToProps = ({playlists}: StoreState) => ({
  playlists,
});

const mapDispatchToProps = (dispatch: Dispatch<PlaylistsActions>): DispatchProps => ({
  loadPlaylists: () => dispatch(playlistsLoadAction()),
});

interface PassedProps {
  className?: string;
}

interface StateProps {
  playlists: Playlists;
}

interface DispatchProps {
  loadPlaylists: () => {};
}

export default connect<StateProps,
  DispatchProps,
  RouteComponentProps<{}>>(mapStateToProps, mapDispatchToProps)(PlaylistMenuStyled);
