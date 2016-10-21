import { PlaylistCreate } from '../../../model/playlist-create';
import { PlaylistCreateState } from '../../../model/state/playlist-create.state';

export const playlistCreateResetCommand = (state: PlaylistCreate, payload: void): PlaylistCreate => {
  state = Object.assign({}, state);
  state.state = PlaylistCreateState.DEFAULT;

  state.name = null;
  state.description = null;

  return state;
};
