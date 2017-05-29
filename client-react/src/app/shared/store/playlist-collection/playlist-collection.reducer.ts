import { PlaylistCollection } from './playlist-collection';

const defaultState: PlaylistCollection = {
  playlists: [],
};

export function playlistCollectionReducer(
  state: PlaylistCollection = defaultState, action: string): PlaylistCollection {
  return {...state};
}
