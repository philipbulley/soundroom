import { User } from "../user";

export class UserFactory {

  static createFromApiResponse(apiData: any): User {

    var user = new User();

    user._id = apiData._id;

    user.name = apiData.name;

    user.avatar = apiData.avatar;

    user.created = new Date(apiData.created);

    user.modified = new Date(apiData.modified);

    if (apiData.hasOwnProperty('googleId')) {
      user.googleId = apiData.googleId;
    }

    if (apiData.hasOwnProperty('spotifyId')) {
      user.spotifyId = apiData.spotifyId;
    }

    if (apiData.hasOwnProperty('facebookId')) {
      user.facebookId = apiData.facebookId;
    }

    if (apiData.hasOwnProperty('twitterId')) {
      user.twitterId = apiData.twitterId;
    }

    if (apiData.hasOwnProperty('userId')) {
      user.userId = apiData.userId;
    }

    return user;
  }

}
