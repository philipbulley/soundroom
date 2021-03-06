import { PlaylistCollection } from '../../../model/playlist-collection';
import { PlaylistSocketEvent } from '../../../model/socket/playlist-socket-event';
import { Playlist } from '../../../model/playlist';
import { PlaylistTrack } from '../../../model/playlist-track';


export const playlistPauseCommand = (state: PlaylistCollection, payload: PlaylistSocketEvent): PlaylistCollection => {
  if (!state.active) {
    // No playlist playing
    return state;
  }

  state = Object.assign({}, state);
  state.playlists = state.playlists.map((playlist: Playlist) => updateIndividualPlaylist(playlist));
  state.active = null;

  return state;
};

function updateIndividualPlaylist(state: Playlist) {
  if (!state.currentPlaylistTrackId) {
    return state;
  }

  state = Object.assign({}, state);

  state.tracks = state.tracks.map((track: PlaylistTrack) => {
    // console.log('playlistReducer: PlaylistAction.PAUSE: track:', track.isPlaying, track);
    if (track.isPlaying) {
      let newTrack: PlaylistTrack = Object.assign({}, track);
      newTrack.isPlaying = false;

      // Assign reference of newly created PlaylistTrack to Playlist
      state.currentPlaylistTrackId = newTrack._id;
      return newTrack;
    }
    return track;
  });

  return state;
}
