import {Artist} from "../artist";
import {ProviderFactory} from "./provider.factory";

export class ArtistFactory {

  static createFromApiResponse( apiData:any ):Artist {

    var artist = new Artist();

    artist._id = apiData._id;

    artist.foreignId = apiData.foreignId;

    artist.created = apiData.created;

    artist.modified = apiData.modified;

    artist.name = apiData.name;

    artist.provider = ProviderFactory.getByString(apiData.provider);

    return artist;
  }

}
