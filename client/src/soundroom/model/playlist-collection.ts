import {Playlist} from "./playlist";
import {PlaylistState} from "./enum/playlist-state";

export class PlaylistCollection {

  // TODO: Change this to PlaylistCollectionState
  loadState: PlaylistState;

  playlists: Playlist[] = [];

}
