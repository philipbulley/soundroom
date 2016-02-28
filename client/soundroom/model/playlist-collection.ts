import {Playlist} from "./playlist";
import {PlaylistState} from "./enum/playlist-state";

export class PlaylistCollection {

  loadState: PlaylistState;

  playlists: Playlist[] = [];

}
