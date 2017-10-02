import { PlaylistCollection } from '../playlist-collection';

export const playlistCollectionLoadCommand = (state: PlaylistCollection): PlaylistCollection => {
  state = {...state};

  state.loading = true;
  delete state.error;

  return state;
};
