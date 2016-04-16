import {Track} from "./track";

/**
 * Represents a Track in the context of a Playlist
 */
export class PlaylistTrack {

  _id:string;

  track:Track;

  // TODO: Change to UpVote[]
  upVotes:any[];

  created:Date;

  modified:Date;

  isPlaying:boolean;

  currentTime:number;

  progress:number;

}
