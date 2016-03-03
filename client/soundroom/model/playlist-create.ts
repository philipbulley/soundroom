import {Playlist} from "./playlist";
import {PlaylistState} from "./enum/playlist-state";
import {PlaylistCreateState} from "./enum/playlist-create-state";

export class PlaylistCreate {

  state:PlaylistCreateState = PlaylistCreateState.DEFAULT;

  name:string;

  description:string;

  /**
   * The newly created playlist.
   * Only available when `state === PlaylistCreateState.SUCCESS` and should only be used for the benefit of the
   * PlaylistCreateComponent displaying some kind of success notification.
   */
  playlistCreated:Playlist;

}
