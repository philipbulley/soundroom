import {Playlist} from "./playlist";
import {PlaylistState} from "./enum/playlist-state";
import {PlaylistCreateState} from "./enum/playlist-create-state";

export class PlaylistCreate {

  state:PlaylistCreateState = PlaylistCreateState.DEFAULT;

  playlist:Playlist = {};

}
