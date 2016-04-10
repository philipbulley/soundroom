import {Playlist} from "./playlist";
import {PlaylistCollectionState} from "./state/playlist-collection.state.ts";

export class PlaylistCollection {

  loadState:PlaylistCollectionState;

  playlists:Playlist[] = [];

  /**
   * The playlist currently playing.
   */
  nowPlaying:Playlist = null;

}
