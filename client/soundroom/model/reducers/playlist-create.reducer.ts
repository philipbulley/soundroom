import {Reducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";
import {PlaylistCreateAction} from "../enum/playlist-create-action";
import {PlaylistCreate} from "../playlist-create";
import {PlaylistCreateState} from "../enum/playlist-create-state";

export const playlistCreateReducer:Reducer<PlaylistCreate> = ( state:PlaylistCreate = new PlaylistCreate(), action:Action ) => {

  console.log('playlistCreateReducer():', action.type);
  console.log(' - action:', action);
  console.log(' - state:', state);

  switch (action.type) {

    case PlaylistCreateAction.RESET:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      newState.state = PlaylistCreateState.DEFAULT;

      newState.playlist = Object.assign({}, state.playlist);
      newState.playlist.name = null;
      newState.playlist.description = null;
      return newState;

    case PlaylistCreateAction.START:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      newState.state = PlaylistCreateState.ADDING_NAME;
      return newState;

    case PlaylistCreateAction.ADD_NAME:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      // Set next state
      newState.state = PlaylistCreateState.ADDING_DESCRIPTION;

      newState.playlist = Object.assign({}, state.playlist);
      newState.playlist.name = action.payload;
      return newState;

    case PlaylistCreateAction.ADD_DESCRIPTION:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      // Set next state
      newState.state = PlaylistCreateState.ADDING_DESCRIPTION;

      newState.playlist = Object.assign({}, state.playlist);
      newState.playlist.description = action.payload;
      return newState;

    case PlaylistCreateAction.CREATE:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      newState.state = PlaylistCreateState.CREATING;
      return newState;

    case PlaylistCreateAction.ERROR:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      newState.state = PlaylistCreateState.ERROR;
      return newState;

    default:
      return state;
  }

};
