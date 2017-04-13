import { TrackFactory } from "./track.factory";
import { UpVoteFactory } from "./up-vote.factory";
import { PlaylistTrack } from "../playlist-track";
import { UserFactory } from "./user.factory";

export class PlaylistTrackFactory {
  static createFromApiResponse(apiData: any): PlaylistTrack {
    return {
      _id: apiData._id,
      track: TrackFactory.createFromApiResponse(apiData.track),
      upVotes: apiData.upVotes.map(upVote => UpVoteFactory.createFromApiResponse(upVote)),
      createdBy: UserFactory.createFromApiResponse(apiData.createdBy),
      playCompleted: apiData.playCompleted ? new Date(apiData.playCompleted) : null,
      created: new Date(apiData.created),
      modified: new Date(apiData.modified),
      isPlaying: false,
      currentTime: 0,
      progress: 0,
    };
  }
}
