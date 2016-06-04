import {Track} from "./track";
import {UpVote} from "./up-vote";
import {User} from "./user";

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
  
  createdBy:User;

}
