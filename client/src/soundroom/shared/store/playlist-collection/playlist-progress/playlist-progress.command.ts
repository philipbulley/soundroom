import { PlaylistCollection } from '../../../model/playlist-collection';
import { PlaylistProgressSocketEvent } from '../../../model/socket/playlist-progress-socket-event';
import { Playlist } from '../../../model/playlist';
import { PlaylistTrack } from '../../../model/playlist-track';

export const playlistProgressCommand = (state: PlaylistCollection, payload: PlaylistProgressSocketEvent): PlaylistCollection => {
  // console.log('playlistProgressCommand:', payload);
  state = Object.assign({}, state);

  // Call playlistReducer on each playlist, forwarding the state and action
  state.playlists = state.playlists.map((playlist: Playlist) => {
    const newPlaylist = updateIndividualPlaylist(playlist, payload);
    // newPlaylist may/may not be a new instance — this is for `playlistReducer` to decide
    if (newPlaylist._id === payload.playlistId) {
      state.active = newPlaylist;
    }
    return newPlaylist;
  });

  return state;
};

/**
 * We use the progress events to determine which playlist is currently playing and which aren't. All playlists in the
 * collection are passed to this function and only updated if necessary.
 */
function updateIndividualPlaylist(playlist: Playlist, payload: PlaylistProgressSocketEvent) {
  let newState: Playlist;

  // Is this playlist transitioning from playing -> not playing?
  if (playlist.current && payload.playlistId !== playlist._id) {
    // This playlist is no longer playing
    newState = Object.assign(new Playlist, playlist);
    newState.current = null;
    newState.tracks = newState.tracks.map((playlistTrack: PlaylistTrack) => {
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
  }

  // Is this playlist currently playing
  if (playlist.current || (!playlist.current && payload.playlistId === playlist._id)) {
    // This playlist is playing

    if (!playlist.tracks) {
      // No changes necessary, as we haven't loaded individual tracks
      return playlist;
    }

    // Playlist's tracks are fully loaded (ie. we've not just loaded the list of playlists, but the details of
    // this playlist).
    newState = Object.assign(new Playlist, playlist);

    // Update the correct playlist track with the progress details
    newState.tracks = newState.tracks.map((playlistTrack: PlaylistTrack) => {
      if (playlistTrack.isPlaying && payload.playlistTrackId !== playlistTrack._id) {
        // This is no longer playing, another track in this playlist is now playing
        let newTrack: PlaylistTrack = Object.assign(new PlaylistTrack, playlistTrack);
        newTrack.isPlaying = false;
        return newTrack;
      } else if (playlistTrack._id === payload.playlistTrackId) {
        // This track is playing
        let newTrack: PlaylistTrack = Object.assign(new PlaylistTrack, playlistTrack);
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

  // No changes to this playlist, return original reference
  return playlist;
}
