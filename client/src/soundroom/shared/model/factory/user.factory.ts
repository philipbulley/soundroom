import { User } from "../user";

export class UserFactory {
  static createFromApiResponse(apiData: any): User {
    const {_id, name, avatar} = apiData;

    return {
      _id,
      name,
      avatar,
      created: new Date(apiData.created),
      modified: new Date(apiData.modified),
      googleId: apiData.hasOwnProperty('googleId') ? apiData.googleId : null,
      spotifyId: apiData.hasOwnProperty('spotifyId') ? apiData.spotifyId : null,
      facebookId: apiData.hasOwnProperty('facebookId') ? apiData.facebookId : null,
      twitterId: apiData.hasOwnProperty('twitterId') ? apiData.twitterId : null,
      userId: apiData.hasOwnProperty('userId') ? apiData.userId : null,
    };
  }
}
