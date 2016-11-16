import { Track } from "../track";
import { AlbumFactory } from "./album.factory";
import { ArtistFactory } from "./artist.factory";
import { ProviderFactory } from "./provider.factory";
import { UserFactory } from "./user.factory";
import { ImageFactory } from "./image.factory";
import { Image } from "../image";

export class TrackFactory {

  static createFromApiResponse(apiData: any): Track {

    const track = new Track();

    track._id = apiData._id;

    track.name = apiData.name;

    track.duration = apiData.duration;

    track.foreignId = apiData.foreignId;

    track.provider = ProviderFactory.getByString(apiData.provider);

    track.album = AlbumFactory.createFromApiResponse(apiData.album);

    track.artists = apiData.artists.map(artistsData => ArtistFactory.createFromApiResponse(artistsData));

    track.images = apiData.images.map(imageData => ImageFactory.createFromApiResponse(imageData))
      .sort((a: Image, b: Image) => a.height > b.height ? 1 : -1);

    track.createdBy = UserFactory.createFromApiResponse(apiData.createdBy);

    track.created = new Date(apiData.created);

    track.modified = new Date(apiData.modified);

    return track;
  }
}
