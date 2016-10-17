import { PlaylistCollection } from "../../../model/playlist-collection";
import { Playlist } from "../../../model/playlist";
import { PlaylistState } from '../../../model/state/playlist.state';
import { DeleteTrackPayload } from './delete-track-payload';

export const deleteTrackCommand = (state: PlaylistCollection, payload: DeleteTrackPayload): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  const playlist: Playlist = Object.assign(
    new Playlist,
    state.playlists.find((playlist: Playlist) => payload.playlist._id === playlist._id)
  );

  playlist.loadState = PlaylistState.DELETING_TRACK;

  state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => payload.playlist._id !== playlist._id),
    playlist,
  ];

  return state;
};
