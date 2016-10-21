import { PlaylistCreate } from '../../../model/playlist-create';
import { PlaylistCreateState } from '../../../model/state/playlist-create.state';

export const playlistCreateAddNameCommand = (state: PlaylistCreate, payload: string): PlaylistCreate => {
  state = Object.assign({}, state);

  // Set next state
  state.state = PlaylistCreateState.ADDING_DESCRIPTION;

  state.name = payload;

  return state;
};
