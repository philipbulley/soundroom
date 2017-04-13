import { Track } from "../track";
import { AlbumFactory } from "./album.factory";
import { ArtistFactory } from "./artist.factory";
import { ProviderFactory } from "./provider.factory";
import { UserFactory } from "./user.factory";
import { ImageFactory } from "./image.factory";
import { Image } from "../image";

export class TrackFactory {
  static createFromApiResponse(apiData: any): Track {
    const {_id, name, duration, foreignId} = apiData;

    return {
      _id,
      name,
      duration,
      foreignId,
      provider: ProviderFactory.getByString(apiData.provider),
      album: AlbumFactory.createFromApiResponse(apiData.album),
      artists: apiData.artists.map(artistsData => ArtistFactory.createFromApiResponse(artistsData)),
      createdBy: UserFactory.createFromApiResponse(apiData.createdBy),
      created: new Date(apiData.created),
      modified: new Date(apiData.modified),
      images: apiData.images.map(imageData => ImageFactory.createFromApiResponse(imageData))
        .sort((a: Image, b: Image) => a.height > b.height ? 1 : -1),
    };
  }
}
