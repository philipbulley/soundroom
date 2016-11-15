import { TrackFactory } from "./track.factory";
import { UpVoteFactory } from "./up-vote.factory";
import { PlaylistTrack } from "../playlist-track";
import { UserFactory } from "./user.factory";

export class PlaylistTrackFactory {

  static createFromApiResponse(apiData: any): PlaylistTrack {

    var playlistTrack = new PlaylistTrack();

    playlistTrack._id = apiData._id;

    playlistTrack.track = TrackFactory.createFromApiResponse(apiData.track);

    playlistTrack.upVotes = apiData.upVotes.map(upVote => UpVoteFactory.createFromApiResponse(upVote));

    playlistTrack.createdBy = UserFactory.createFromApiResponse(apiData.createdBy);

    playlistTrack.playCompleted = apiData.playCompleted ? new Date(apiData.playCompleted) : null;

    playlistTrack.created = new Date(apiData.created);

    playlistTrack.modified = new Date(apiData.modified);

    return playlistTrack;
  }

}
