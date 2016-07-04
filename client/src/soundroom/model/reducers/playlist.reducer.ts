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

    case PlaylistAction.LOADING:
      if (action.payload !== state._id) {
        return state;
      }
      newState = Object.assign(new Playlist, state);
      newState.loadState = PlaylistState.LOADING;
      return newState;

    case PlaylistAction.ERROR_LOADING:
      if (action.payload !== state._id) {
        return state;
      }
      newState = Object.assign(new Playlist, state);
      newState.loadState = null;
      return newState;

    case PlaylistAction.PROGRESS:

      let payload:PlaylistProgressSocketEvent = action.payload;

      if (state.current && payload.playlistId !== state._id) {
        // This playlist is no longer playing
        newState = Object.assign(new Playlist, state);
        newState.current = null;
        newState.tracks = newState.tracks.map(( playlistTrack:PlaylistTrack ) => {
          if (playlistTrack.isPlaying) {
            // This is the track that WAS playing
            let newTrack = Object.assign(new PlaylistTrack, playlistTrack);
            newTrack.isPlaying = false;
            return newTrack;
          }

          // No changes to this track
          return playlistTrack;
        });
        return newState;
      } else if (state.current || (!state.current && payload.playlistId === state._id)) {
        // This playlist is playing

        if (!state.tracks) {
          // No changes necessary, as we haven't loaded individual tracks
          return state;
        }

        // Playlist's tracks are fully loaded (ie. we've not just loaded the list of playlists, but the details of
        // this playlist).
        newState = Object.assign(new Playlist, state);

        // Update the correct playlist track with the progress details
        newState.tracks = newState.tracks.map(( playlistTrack:PlaylistTrack ) => {
          if (playlistTrack.isPlaying && payload.playlistTrackId !== playlistTrack._id) {
            // This is no longer playing, another track in this playlist is now playing
            let newTrack:PlaylistTrack = Object.assign(new PlaylistTrack, playlistTrack);
            newTrack.isPlaying = false;
            return newTrack;
          } else if (playlistTrack._id === payload.playlistTrackId) {
            // This track is playing
            let newTrack:PlaylistTrack = Object.assign(new PlaylistTrack, playlistTrack);
            newTrack.isPlaying = true;
            // Ignoring presence of `payload.duration` as it already exists on `PlaylistTrack.track`
            newTrack.currentTime = payload.currentTime;
            newTrack.progress = payload.progress;

            // Keep Playlist.nowPlaying up to date with latest instance of currently playing PlaylistTrack
            newState.current = newTrack;
            return newTrack;
          }
          return playlistTrack;
        });

        return newState;
      }
      return state;


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
    case PlaylistAction.ADDING_TRACK:
      if (action.payload.playlist._id !== state._id) {
        return state;
      }

      newState = Object.assign(new Playlist, state);
      newState.loadState = PlaylistState.ADDING_TRACK;
      return newState;

    case PlaylistAction.ADD_TRACK:
    case PlaylistAction.UPDATE_TRACK:
      if (action.payload.playlistId !== state._id) {
        return state;
      }

      newState = Object.assign(new Playlist, state);
      newState.loadState = null;

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

    case PlaylistAction.ERROR_ADDING_TRACK:
      if (action.payload.playlist._id !== state._id) {
        return state;
      }

      newState = Object.assign(new Playlist, state);
      newState.loadState = null;
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
const sortPlaylistTracks = ( tracks:PlaylistTrack[], playlistTrackIds:string[] ):PlaylistTrack[] => {
  const sortOrder = {};
  playlistTrackIds.forEach(( id, index ) => sortOrder[id] = index);

  return [...tracks].sort(( a:PlaylistTrack, b:PlaylistTrack ) => sortOrder[a._id] > sortOrder[b._id] ? 1 : -1);
};
