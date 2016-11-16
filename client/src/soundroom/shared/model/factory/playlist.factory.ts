import { Playlist } from "../playlist";
import { PlaylistTrackFactory } from "./playlist-track.factory";

export class PlaylistFactory {

  static createFromApiResponse(apiData: any): Playlist {

    const playlist = new Playlist();

    playlist._id = apiData._id;

    playlist.name = apiData.name;

    playlist.description = apiData.description;

    playlist.created = apiData.created;

    playlist.modified = apiData.modified;

    playlist.tracks = apiData.tracks
      ? apiData.tracks.map(playlistTrackData => PlaylistTrackFactory.createFromApiResponse(playlistTrackData))
      : null;

    return playlist;

  }

}
