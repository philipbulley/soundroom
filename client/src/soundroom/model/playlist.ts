import {PlaylistState} from "./state/playlist.state.ts";
import {PlaylistTrack} from "./playlist-track";

export class Playlist {

  /** _id is the MongoDB convention, not intending this to appear as "private" */
  _id:string;

  name:string;

  description:string;

  created:string;

  modified:string;

  tracks:PlaylistTrack[] = [];

  loadState:PlaylistState = null;

  /**
   * The track currently playing.
   *
   * This is only populated with the track if Playlist.tracks has been populated.
   * If you only want to know which playlist is playing, look at `PlaylistCollection.active`.
   *
   * TODO: Change to PlaylistTrack id
   */
  current:PlaylistTrack = null;

  /**
   * Read-only convenience property to determine whether this playlist is playing.
   */
  get isPlaying():boolean {
    return !this.current
      ? false
      : this.current.isPlaying;
  }

}
