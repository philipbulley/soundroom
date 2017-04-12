import { PlaylistState } from "./state/playlist.state.ts";
import { PlaylistTrack } from "./playlist-track";

export class Playlist {

  /** _id is the MongoDB convention, not intending this to appear as "private" */
  _id: string;

  name: string;

  description: string;

  created: string;

  modified: string;

  tracks: PlaylistTrack[] = [];

  loadState: PlaylistState = null;

  /**
   * The ID of the track currently playing.
   *
   * This is only populated with the track ID if Playlist.tracks has been populated.
   *
   * Tip: If you only want to know which playlist is playing, look at `PlaylistCollection.active`.
   */
  currentPlaylistTrackId: string = null;
}
