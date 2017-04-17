import { Playlist } from "../playlist";
import { PlaylistTrackFactory } from "./playlist-track.factory";
import { PlaylistState } from '../state/playlist.state';

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
      error: null,
    };
  }

  static createEmpty(_id: string): Playlist {
    return {
      _id,
      name: null,
      description: null,
      created: null,
      modified: null,
      tracks: [],
      loadState: null,
      currentPlaylistTrackId: null,
      error: null,
    };
  }
}
