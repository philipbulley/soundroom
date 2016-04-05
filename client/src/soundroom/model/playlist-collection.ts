import {Playlist} from "./playlist";
import {PlaylistCollectionState} from "./enum/playlist-collection-state";

export class PlaylistCollection {

  loadState: PlaylistCollectionState;

  playlists: Playlist[] = [];

}
