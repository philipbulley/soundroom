import { PlaylistCreate } from '../../../model/playlist-create';
import { PlaylistCreateState } from '../../../model/state/playlist-create.state';

export const playlistCreateErrorCommand = (state: PlaylistCreate, payload: Error): PlaylistCreate => {
  state = Object.assign({}, state);

  state.state = PlaylistCreateState.ERROR;
  state.error = payload;

  return state;
};
