import { PlaylistCreate } from '../../../model/playlist-create';
import { PlaylistCreateState } from '../../../model/state/playlist-create.state';
import { Playlist } from '../../../model/playlist';

export const playlistCreateSuccessCommand = (state: PlaylistCreate, payload: Playlist): PlaylistCreate => {
  state = Object.assign({}, state);

  state.state = PlaylistCreateState.SUCCESS;
  state.playlistCreated = payload;

  return state;
};
