import { PlaylistCreate } from '../../../model/playlist-create';
import { PlaylistCreateState } from '../../../model/state/playlist-create.state';
import { ErrorResult } from '../../../model/error/error-result';

export const playlistCreateErrorCommand = (state: PlaylistCreate, payload: ErrorResult): PlaylistCreate => {
  state = Object.assign({}, state);

  state.state = PlaylistCreateState.ERROR;
  state.error = payload;

  return state;
};
