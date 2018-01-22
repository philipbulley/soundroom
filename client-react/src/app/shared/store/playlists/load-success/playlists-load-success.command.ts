import { Playlists, PlaylistsItem } from '../playlists';

export const playlistsLoadSuccessCommand = (
  state: Playlists, playlistsItems: PlaylistsItem[]): Playlists => {
  state = {...state};

  state.loading = false;
  state.items = playlistsItems;

  return state;
};
