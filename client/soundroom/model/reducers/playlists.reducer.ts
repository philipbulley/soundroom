import {Reducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";

export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

export const playlistsReducer:Reducer<Playlist[]> = ( playlists:Playlist[] = [], action:Action ) => {

  console.log('playlists reducer', playlists, action);

  switch (action.type) {
    case ADD_PLAYLIST:
      let newState = [...playlists, ...action.payload];
      console.log(' - ', ADD_PLAYLIST, 'action:', action.payload, 'newState:', newState);
      return newState;

    default:
      return playlists;
  }

};
