import {PlaylistTrack} from "../playlist-track";
import {TrackFactory} from "./track.factory";

export class PlaylistTrackFactory {

  static createFromApiResponse( apiData:any ):PlaylistTrack {

    var playlistTrack = new PlaylistTrack();

    playlistTrack._id = apiData._id;

    playlistTrack.track = TrackFactory.createFromApiResponse(apiData.track);

    // TODO: Change to UpVote[]
    playlistTrack.upVotes = apiData.upVotes;

    playlistTrack.created = new Date(apiData.created);

    playlistTrack.modified = new Date(apiData.modified);

    return playlistTrack;
  }

}
