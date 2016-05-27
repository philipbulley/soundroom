import {TrackFactory} from "./track.factory";
import {UpVoteFactory} from "./up-vote.factory";
import {PlaylistTrack} from "../playlist-track";

export class PlaylistTrackFactory {

  static createFromApiResponse( apiData:any ):PlaylistTrack {

    var playlistTrack = new PlaylistTrack();

    playlistTrack._id = apiData._id;

    playlistTrack.track = TrackFactory.createFromApiResponse(apiData.track);

    playlistTrack.upVotes = apiData.upVotes.map(upVote => UpVoteFactory.createFromApiResponse(upVote));

    playlistTrack.created = new Date(apiData.created);

    playlistTrack.modified = new Date(apiData.modified);

    return playlistTrack;
  }

}
