import {PlaylistState} from "./enum/playlist-state";

export class Playlist {

  /** _id is the MongoDB convention, not intending this to appear as "private" */
  _id:string;

  name:string;

  description:string;

  created:string;

  modified:string;

  tracks:any[];

  loadState:PlaylistState = null;

  constructor() {

  }

}
