import { Artist } from "../artist";
import { ProviderFactory } from "./provider.factory";

export class ArtistFactory {
  static createFromApiResponse(apiData: any): Artist {
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
