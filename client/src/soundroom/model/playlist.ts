import {PlaylistState} from "./state/playlist.state.ts";
import {PlaylistTrack} from "./playlist-track";

export class Playlist {

  /** _id is the MongoDB convention, not intending this to appear as "private" */
  _id:string;

  name:string;

  description:string;

  created:string;

  modified:string;

  tracks:PlaylistTrack[];

  loadState:PlaylistState = null;

  constructor() {

  }

}
