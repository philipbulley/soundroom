import { Album } from "../album";
import { ProviderFactory } from "./provider.factory";

export class AlbumFactory {
  static createFromApiResponse(apiData: any): Album {
    const {_id, foreignId, created, modified, name} = apiData;

    return {
      _id,
      foreignId,
      created,
      modified,
      name,
      provider: ProviderFactory.getByString(apiData.provider),
    };
  }
}
