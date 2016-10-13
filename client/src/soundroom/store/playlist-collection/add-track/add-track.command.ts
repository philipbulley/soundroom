import { PlaylistCollection } from "../../../model/playlist-collection";
import { Playlist } from "../../../model/playlist";
import { PlaylistState } from '../../../model/state/playlist.state';
import { AddTrackPayload } from './add-track-payload';

export const addTrackCommand = (state: PlaylistCollection, payload: AddTrackPayload): PlaylistCollection => {
  state = Object.assign({}, state);

  // Find the playlist
  const playlist: Playlist = Object.assign(
    new Playlist,
    state.playlists.find((playlist: Playlist) => payload.playlist._id === playlist._id),
  );

  playlist.loadState = PlaylistState.ADDING_TRACK;

  state.playlists = [
    ...state.playlists.filter((playlist: Playlist) => payload.playlist._id !== playlist._id),
    playlist
  ];

  return state;
};
