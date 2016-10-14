import {ActionReducer, Action} from '@ngrx/store';
import {Playlist} from "../playlist";
import {PlaylistAction} from "../action/playlist.action.ts";
import {PlaylistState} from "../state/playlist.state.ts";
import {PlaylistProgressSocketEvent} from "../socket/playlist-progress-socket-event";
import {PlaylistTrack} from "../playlist-track";

export const playlistReducer:ActionReducer<Playlist> = ( state:Playlist = new Playlist, action:Action ) => {

  // console.log('playlistReducer():', action.type, state);
  // console.log(' - action:', action);
  // console.log(' - state:', state);

  let newState:Playlist;

  switch (action.type) {

    case PlaylistAction.PAUSE:
      if (state.current) {
        newState = Object.assign(new Playlist, state);

        newState.tracks = newState.tracks.map(( track:PlaylistTrack ) => {
          // console.log('playlistReducer: PlaylistAction.PAUSE: track:', track.isPlaying, track);
          if (track.isPlaying) {
            let newTrack:PlaylistTrack = Object.assign(new PlaylistTrack, track);
            newTrack.isPlaying = false;

            // Assign reference of newly created PlaylistTrack to Playlist
            newState.current = newTrack;
            return newTrack;
          }
          return track;
        });
        // console.log('playlistReducer: PlaylistAction.PAUSE: current playlist after:', newState);
        return newState;
      }

      // No change to this playlist
      return state;

    // TODO: Implement the following with payload:{playlist, track}
    case PlaylistAction.DELETE_TRACK:
      // TODO: Add this to addTrackCommand
      if (action.payload.playlist._id !== state._id) {
        return state;
      }

      newState = Object.assign(new Playlist, state);
      newState.loadState = PlaylistState.ADDING_TRACK;  // This shuld be delete for delete action
      return newState;

    case PlaylistAction.TRACK_ADDED:
    case PlaylistAction.TRACK_UPDATED:
      if (action.payload.playlistId !== state._id) {
        return state;
      }

      newState = Object.assign(new Playlist, state);

      // Create new array of tracks OTHER than the track we're adding (in case it's an UPDATE_TRACK)
      newState.tracks = state.tracks.filter(( playlistTrack:PlaylistTrack ) => {
        return playlistTrack._id !== action.payload.playlistTrack._id;
      });

      // Add new track
      newState.tracks.push(action.payload.playlistTrack);

      // Sort the tracks based on the playlistTrackIds received
      newState.tracks = sortPlaylistTracks(newState.tracks, action.payload.playlistTrackIds);

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

/**
 * Sorts the PlaylistTracks in a playlist based on an array of corresponding PlaylistTrack._id values.
 *
 * @param tracks
 * @param playlistTrackIds
 * @returns New instance of PlaylistTrack[] with freshly sorted tracks
 */
function sortPlaylistTracks( tracks:PlaylistTrack[], playlistTrackIds:string[] ):PlaylistTrack[] {
  const sortOrder = {};
  playlistTrackIds.forEach(( id, index ) => sortOrder[id] = index);

  return [...tracks].sort(( a:PlaylistTrack, b:PlaylistTrack ) => sortOrder[a._id] > sortOrder[b._id] ? 1 : -1);
};
