import { Track } from './track';
import { UpVote } from './up-vote';
import { User } from './user/user';

/**
 * Represents a Track in the context of a Playlist
 */
export interface PlaylistTrack {
  _id: string;
  track: Track;
  upVotes: UpVote[];
  created: Date;
  modified: Date;
  isPlaying: boolean;
  currentTime: number;
  progress: number;
  createdBy: User;
  playCompleted: Date;
}
