import {Injectable} from '@angular/core';

@Injectable()
export class SpotifyService {

  private ACCEPT_REGEX:RegExp = /^https?:\/\/open.spotify\.com\/track\/(.*)/;

  linkToSpotifyUri( url:string ) {
    if (url.charAt(url.length - 1) === '/') {
      // Trim trailing slash
      url = url.substr(0, url.length - 2);
    }

    const matches = url.match(/\/track\/(.*)/);
    if (!matches.length || matches.length === 1) {
      throw new Error('Unrecognized format for Spotify Track HTTP URI');
    }
    const trackId = matches[1];
    const spotifyUri = `spotify:track:${trackId}`;

    return spotifyUri;
  }

  isValidSpotifyUrl( url:string ) {
    console.log('SpotifyService.isValidSpotifyUrl()', this.ACCEPT_REGEX.test(url), url);
    return this.ACCEPT_REGEX.test(url);
  }

}
