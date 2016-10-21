import { PlaylistCreate } from '../../../model/playlist-create';
import { PlaylistCreateState } from '../../../model/state/playlist-create.state';

export const playlistCreateStartCommand = (state: PlaylistCreate, payload: void): PlaylistCreate => {
  state = Object.assign({}, state);
  state.state = PlaylistCreateState.ADDING_NAME;

  return state;
};
