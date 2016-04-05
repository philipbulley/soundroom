import {Reducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";
import {PlaylistAction} from "../enum/playlist-action";
import {PlaylistCollection} from "../playlist-collection";
import {PlaylistState} from "../enum/playlist-state";
import {getPlaylistById, getPlaylistsWithoutId} from "../../util/playlist.util";
import {playlistReducer} from "./playlist.reducer";

export const playlistCollectionReducer:Reducer<PlaylistCollection> = ( state:PlaylistCollection = new PlaylistCollection, action:Action ) => {

  // console.log('playlistCollectionReducer():', action.type);
  // console.log(' - action:', action);
  // console.log(' - state:', state);

  let newState:PlaylistCollection;

  switch (action.type) {

    case PlaylistAction.LOAD:
      newState = Object.assign(new PlaylistCollection, state);
      newState.playlists = newState.playlists.map((playlist:Playlist) => playlistReducer(playlist, action));
      newState.loadState = PlaylistState.LOADING;
      return newState;

    case PlaylistAction.LOAD_ALL:
      // Update state only
      newState = Object.assign(new PlaylistCollection, state);
      newState.loadState = PlaylistState.LOADING_ALL;
      return newState;

    case PlaylistAction.ADD:
      // Add an array of new Playlists to our PlaylistCollection

      let newPlaylists:Playlist[] = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      newState = Object.assign(new PlaylistCollection, state);

      // Overwrite existing playlists with those in the incoming newPlaylists array
      newState.playlists = state.playlists
        .map(( playlist:Playlist ) => {
          // Is this playlist being replaced?
          let replacementPlaylist = getPlaylistById(playlist._id, newPlaylists);

          // Only keep those playlists in `newPlaylists` that aren't replacing existing playlists
          newPlaylists = getPlaylistsWithoutId(playlist._id, newPlaylists);

          return replacementPlaylist
            ? replacementPlaylist
            : playlist;
        });

      // Combine old+replaced playlists with brand new playlists
      newState.playlists = [...newState.playlists, ...newPlaylists];

      newState.loadState = null;

      console.log('playlistCollectionReducer: PlaylistAction.ADD: newState:', newState);

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
