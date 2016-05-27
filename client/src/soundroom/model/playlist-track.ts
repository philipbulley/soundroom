import {Track} from "./track";
import {UpVote} from "./up-vote";

/**
 * Represents a Track in the context of a Playlist
 */
export class PlaylistTrack {

  _id:string;

  track:Track;

  upVotes:UpVote[];

  created:Date;

  modified:Date;

  isPlaying:boolean;

  currentTime:number;

  progress:number;

}
