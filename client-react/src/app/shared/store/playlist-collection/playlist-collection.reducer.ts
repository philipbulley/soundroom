import { PlaylistCollection } from './playlist-collection';
import { Action } from 'redux';

const defaultState: PlaylistCollection = {
  playlists: [],
};

export function playlistCollectionReducer(
  state: PlaylistCollection = defaultState, action: Action): PlaylistCollection {
  return {...state};
}
