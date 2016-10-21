import { PlaylistCreate } from '../../../model/playlist-create';
import { PlaylistCreateState } from '../../../model/state/playlist-create.state';

export const playlistCreateAddDescriptionCreateCommand = (state: PlaylistCreate, payload: string): PlaylistCreate => {
  state = Object.assign({}, state);

  // Set next state
  state.state = PlaylistCreateState.CREATING;

  state.description = payload;

  return state;
};
