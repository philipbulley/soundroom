import {Track} from "../track";
import {AlbumFactory} from "./album.factory";
import {ArtistFactory} from "./artist.factory";
import {ProviderFactory} from "./provider.factory";

export class TrackFactory {

  static createFromApiResponse( apiData:any ):Track {

    var track = new Track();

    track._id = apiData._id;

    track.name = apiData.name;

    track.duration = apiData.duration;

    track.foreignId = apiData.foreignId;

    track.provider = ProviderFactory.getByString(apiData.provider);

    track.album = AlbumFactory.createFromApiResponse( apiData.album );

    track.artists = apiData.artists.map( artistsData => ArtistFactory.createFromApiResponse( artistsData ) );

    track.created = new Date( apiData.created );

    track.modified = new Date( apiData.modified );

    return track;
  }
}
