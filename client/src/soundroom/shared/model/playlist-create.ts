import { Playlist } from "./playlist";
import { PlaylistCreateState } from "./state/playlist-create.state.ts";

export interface PlaylistCreate {

  state: PlaylistCreateState;

  name: string;

  description: string;

  /**
   * The newly created playlist.
   * Only available when `state === PlaylistCreateState.SUCCESS` and should only be used for the benefit of the
   * PlaylistCreateComponent displaying some kind of success notification.
   */
  playlistCreated: Playlist;

  error?: Error;
}
