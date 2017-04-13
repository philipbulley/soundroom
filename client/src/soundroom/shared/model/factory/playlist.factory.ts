import { Playlist } from "../playlist";
import { PlaylistTrackFactory } from "./playlist-track.factory";

export class PlaylistFactory {
  static createFromApiResponse(apiData: any): Playlist {
    const {_id, name, description, created, modified} = apiData;

    return {
      _id,
      name,
      description,
      created,
      modified,
      tracks: apiData.tracks
        ? apiData.tracks.map(playlistTrackData => PlaylistTrackFactory.createFromApiResponse(playlistTrackData))
        : null,
      loadState: null,
      currentPlaylistTrackId: null,
    };
  }
}
