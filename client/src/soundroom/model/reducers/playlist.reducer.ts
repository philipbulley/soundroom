import {Reducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";
import {PlaylistAction} from "../enum/playlist-action";
import {PlaylistState} from "../enum/playlist-state";

export const playlistReducer:Reducer<Playlist> = ( state:Playlist = new Playlist, action:Action ) => {

  //console.log('playlistReducer():', action.type);
  //console.log(' - action:', action);
  //console.log(' - state:', state);

  let newState:Playlist;

  switch (action.type) {

    //case PlaylistAction.LOAD:
      // Update state only
      //newState = Object.assign(new Playlist, state);
      //newState.loadState = PlaylistState.LOADING;
      //return newState;


    default:
      return state;
  }

};
