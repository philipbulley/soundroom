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

      newState.name = null;
      newState.description = null;
      return newState;

    case PlaylistCreateAction.START:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      newState.state = PlaylistCreateState.ADDING_NAME;
      return newState;

    case PlaylistCreateAction.ADD_NAME:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      // Set next state
      newState.state = PlaylistCreateState.ADDING_DESCRIPTION;

      newState.name = action.payload;
      return newState;

    case PlaylistCreateAction.ADD_DESCRIPTION_AND_CREATE:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      // Set next state
      newState.state = PlaylistCreateState.CREATING;

      newState.description = action.payload;
      return newState;

    case PlaylistCreateAction.ERROR:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      newState.state = PlaylistCreateState.ERROR;
      return newState;

    case PlaylistCreateAction.SUCCESS:
      let newState:PlaylistCreate = Object.assign(new PlaylistCreate, state);
      newState.state = PlaylistCreateState.SUCCESS;
      newState.playlistCreated = action.payload;
      return newState;

    default:
      return state;
  }

};
