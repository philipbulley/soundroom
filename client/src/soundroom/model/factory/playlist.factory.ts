import {Playlist} from "../playlist";

export class PlaylistFactory {

  static createFromApiResponse( apiData:any ):Playlist {

    var playlist = new Playlist();

    playlist._id = apiData._id;

    playlist.name = apiData.name;

    playlist.description = apiData.description;

    playlist.created = apiData.created;

    playlist.modified = apiData.modified;

    // TODO: Create individual track objects
    playlist.tracks = apiData.tracks;

    return playlist;

  }

}
