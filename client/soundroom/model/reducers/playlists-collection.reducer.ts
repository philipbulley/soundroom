import {Reducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";
import {PlaylistAction} from "../enum/playlist-action";
import {PlaylistCollection} from "../playlist-collection";
import {PlaylistState} from "../enum/playlist-state";

export const playlistCollectionReducer:Reducer<PlaylistCollection> = ( state:PlaylistCollection = new PlaylistCollection(), action:Action ) => {

  console.log('playlistCollectionReducer():', action.type);
  console.log(' - action:', action);
  console.log(' - state:', state);

  switch (action.type) {

    case PlaylistAction.LOAD_ALL:
      let newState = Object.assign({}, state);
      newState.loadState = PlaylistState.LOADING_ALL;
      return newState;

    case PlaylistAction.ADD:
      let newState:PlaylistCollection = Object.assign(new PlaylistCollection(), state);
      newState.playlists = [...state.playlists, ...action.payload];
      newState.loadState = null;
      return newState;

    default:
      return state;
  }

};
