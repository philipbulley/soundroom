import { PlaylistCollection } from '../playlist-collection';
import { ErrorResult } from '../../../error/error-result';

export const playlistCollectionLoadErrorCommand = (
  state: PlaylistCollection, payload: ErrorResult): PlaylistCollection => {
  state = {...state};

  state.loading = false;
  state.error = payload;

  return state;
};
