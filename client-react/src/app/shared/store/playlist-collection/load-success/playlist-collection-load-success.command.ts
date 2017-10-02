import { PlaylistCollection, PlaylistCollectionItem } from '../playlist-collection';

export const playlistCollectionLoadSuccessCommand = (
  state: PlaylistCollection, playlistCollectionItems: PlaylistCollectionItem[]): PlaylistCollection => {
  state = {...state};

  state.loading = false;
  state.items = playlistCollectionItems;

  return state;
};
