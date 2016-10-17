import {ActionReducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";
import {PlaylistAction} from "../action/playlist.action.ts";
import {PlaylistState} from "../state/playlist.state.ts";
import {PlaylistProgressSocketEvent} from "../socket/playlist-progress-socket-event";
import {PlaylistTrack} from "../playlist-track";
import { sortPlaylistTracks } from '../../util/playlist.util';

export const playlistReducer:ActionReducer<Playlist> = ( state:Playlist = new Playlist, action:Action ) => {

  // console.log('playlistReducer():', action.type, state);
  // console.log(' - action:', action);
  // console.log(' - state:', state);

  let newState:Playlist;

  switch (action.type) {

    case PlaylistAction.TRACK_ADDED:
    case PlaylistAction.TRACK_UPDATED:
      if (action.payload.playlistId !== state._id) {
        return state;
      }

      newState = Object.assign(new Playlist, state);



      // console.log('playlistReducer: PlaylistAction.ADD_TRACK: newState:', newState);
      return newState;

    case PlaylistAction.TRACK_DELETED:
      if (action.payload.playlistId !== state._id) {
        return state;
      }

      newState = Object.assign(new Playlist, state);

      // Create new array of tracks OTHER than the track we're deleting
      newState.tracks = state.tracks.filter(( playlistTrack:PlaylistTrack ) => {
        return playlistTrack._id !== action.payload.playlistTrack._id;
      });

      // Sort the tracks based on the playlistTrackIds received
      newState.tracks = sortPlaylistTracks(newState.tracks, action.payload.playlistTrackIds);
      return newState;

    default:
      return state;
  }

};


