import {Album} from "../album";
import {ProviderFactory} from "./provider.factory";

export class AlbumFactory {

  static createFromApiResponse( apiData:any ):Album {

    var album = new Album();

    album._id = apiData._id;

    album.foreignId = apiData.foreignId;

    album.created = apiData.created;

    album.modified = apiData.modified;

    album.name = apiData.name;

    album.provider = ProviderFactory.getByString(apiData.provider);

    return album;
  }

}
