import { Image } from "../image";

export class ImageFactory {
  static createFromApiResponse(apiData: any): Image {
    const {_id, url, width, height} = apiData;

    return {
      _id,
      url,
      width,
      height,
    };
  }
}
