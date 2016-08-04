import {ActionReducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";
import {PlaylistAction} from "../action/playlist.action.ts";
import {PlaylistCollection} from "../playlist-collection";
import {getPlaylistById, getPlaylistsWithoutId} from "../../util/playlist.util";
import {playlistReducer} from "./playlist.reducer";
import {PlaylistCollectionState} from "../state/playlist-collection.state.ts";
import {PlaylistCollectionAction} from "../action/playlist-collection.action.ts";
import {PlaylistProgressSocketEvent} from "../socket/playlist-progress-socket-event";

export const playlistCollectionReducer:ActionReducer<PlaylistCollection> = ( state:PlaylistCollection = new PlaylistCollection, action:Action ) => {

  // console.log('playlistCollectionReducer():', action.type);
  // console.log(' - action:', action);
  // console.log(' - state:', state);

  let newState:PlaylistCollection;

  switch (action.type) {

    // All PlaylistActions to be caught here and mapped to each playlist
    case PlaylistAction.LOADING:
    case PlaylistAction.ERROR_LOADING:
    case PlaylistAction.ADDING_TRACK:
    case PlaylistAction.ADD_TRACK:
    case PlaylistAction.UPDATE_TRACK:
    case PlaylistAction.ADDING_TRACK_SUCCESS:
    case PlaylistAction.ADDING_TRACK_ERROR:
      newState = Object.assign(new PlaylistCollection, state);
      newState.playlists = newState.playlists.map(( playlist:Playlist ) => playlistReducer(playlist, action));
      return newState;

    case PlaylistAction.PROGRESS:
      const payload:PlaylistProgressSocketEvent = action.payload;

      newState = Object.assign(new PlaylistCollection, state);
      newState.playlists = newState.playlists.map(( playlist:Playlist ) => {
        const newPlaylist = playlistReducer(playlist, action);
        // newPlaylist may/may not be a new instance — this is for `playlistReducer` to decide
        if (newPlaylist._id === payload.playlistId) {
          newState.active = newPlaylist;
        }
        return newPlaylist;
      });
      return newState;

    case PlaylistAction.PAUSE:
      if (!state.active) {
        // No playlist playing
        return state;
      }

      newState = Object.assign(new PlaylistCollection, state);
      newState.playlists = newState.playlists.map(( playlist:Playlist ) => playlistReducer(playlist, action));
      newState.active = null;
      return newState;

    case PlaylistCollectionAction.LOADING:
      // Update state only
      newState = Object.assign(new PlaylistCollection, state);
      newState.loadState = PlaylistCollectionState.LOADING;
      return newState;

    case PlaylistCollectionAction.ERROR_LOADING:
      newState = Object.assign({}, state);
      newState.loadState = null;
      return newState;

    case PlaylistCollectionAction.ADD:
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

          // If no tracks in replacement playlist, but we have tracks in old, copy them across
          if (replacementPlaylist && playlist.tracks && !replacementPlaylist.tracks) {
            replacementPlaylist.tracks = playlist.tracks;
          }

          // Only keep those playlists in `newPlaylists` that aren't replacing existing playlists
          newPlaylists = getPlaylistsWithoutId(playlist._id, newPlaylists);

          return replacementPlaylist
            ? replacementPlaylist
            : playlist;
        });

      // Combine old+replaced playlists with brand new playlists
      newState.playlists = [...newState.playlists, ...newPlaylists];

      newState.loadState = null;

      // console.log('playlistCollectionReducer: PlaylistAction.ADD: newState:', newState);

      return newState;

    case PlaylistCollectionAction.DELETING:
      newState = Object.assign({}, state);
      newState.loadState = PlaylistCollectionState.DELETING;
      return newState;

    case PlaylistCollectionAction.ERROR_DELETING:
      newState = Object.assign({}, state);
      newState.loadState = null;
      return newState;

    case PlaylistCollectionAction.DELETE:
      newState = Object.assign({}, state);
      newState.loadState = null;

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
