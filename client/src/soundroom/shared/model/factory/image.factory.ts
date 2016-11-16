import { Image } from "../image";

export class ImageFactory {

  static createFromApiResponse(apiData: any): Image {

    const image = new Image();

    image._id = apiData._id;

    image.url = apiData.url;

    image.width = apiData.width;

    image.height = apiData.height;

    return image;
  }

}
