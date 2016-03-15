import {Reducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";
import {PlaylistAction} from "../enum/playlist-action";
import {PlaylistCollection} from "../playlist-collection";
import {PlaylistState} from "../enum/playlist-state";
import {playlistReducer} from "./playlist.reducer";

export const playlistCollectionReducer:Reducer<PlaylistCollection> = ( state:PlaylistCollection = new PlaylistCollection, action:Action ) => {

  //console.log('playlistCollectionReducer():', action.type);
  //console.log(' - action:', action);
  //console.log(' - state:', state);

  let newState:PlaylistCollection;

  switch (action.type) {

    case PlaylistAction.LOAD:
      //return state.playlists.map(playlist => playlistReducer(playlist, action));
      break;

    case PlaylistAction.LOAD_ALL:
      // Update state only
      newState = Object.assign(new PlaylistCollection, state);
      newState.loadState = PlaylistState.LOADING_ALL;
      return newState;

    case PlaylistAction.ADD:
      // Add an array of new Playlists to our PlaylistCollection

      if (!Array.isArray(action.payload)) {
        action.payload = [action.payload];
      }

      newState = Object.assign(new PlaylistCollection, state);
      newState.playlists = [...state.playlists, ...action.payload];
      newState.loadState = null;
      return newState;

    case PlaylistAction.DELETE:
      newState = Object.assign({}, state);
      let playlist:Playlist = action.payload;

      const i = newState.playlists.indexOf(playlist);
      newState.playlists = [
        ...newState.playlists.slice(0, i),
        ...newState.playlists.slice(i + 1)
      ];
      return newState;

    default:
      return state;
  }

};
