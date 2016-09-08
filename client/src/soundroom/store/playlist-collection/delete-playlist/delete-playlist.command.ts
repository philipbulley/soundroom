import { PlaylistCollectionState } from "../../../model/state/playlist-collection.state";
import { PlaylistCollection } from "../../../model/playlist-collection";
import { Playlist } from "../../../model/playlist";

export const deletePlaylistCommand = ( state: PlaylistCollection, playlist: Playlist ): PlaylistCollection => {

  state = Object.assign({}, state);
  state.loadState = PlaylistCollectionState.DELETING_PLAYLIST;

  return state;
};
