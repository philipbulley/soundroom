import { Playlist } from "./playlist";
import { PlaylistCollectionState } from "./state/playlist-collection.state.ts";

export interface PlaylistCollection {

  loadState: PlaylistCollectionState;

  playlists: Playlist[];

  /**
   * The currently active playlist.
   * TODO: Change to ID of the playlist
   */
  active: Playlist;

}
