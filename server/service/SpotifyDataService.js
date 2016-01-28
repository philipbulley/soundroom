// import _ from 'lodash';
// import log from './../util/LogUtil';
import FunctionUtil from './../util/FunctionUtil';
import SpotifyTrackFactory from './../model/factory/SpotifyTrackFactory';
import spotifyService from './SpotifyService';

class SpotifyDataService {

  constructor () {
    FunctionUtil.bindAllMethods(this);
  }

  getTrack (id) {
    //console.log('SpotifyDataService.getTrack():', id, 'spotifyService:', this.spotifyService);

    if (process.env.MOCK_SPOTIFY === 'true') {
      return MockSpotifyDataService.getTrack(id);
    }

    const trackResponse = spotifyService.getTrack(id);
    console.log('SpotifyDataService.getTrack: trackResponse:', trackResponse);
    return SpotifyTrackFactory.create(trackResponse);
  }

  getTrackArtwork (albumId) {
    return spotifyService.getImage(albumId);
  }

}

///////////////////////////////////////////////////

const MockSpotifyDataService = {

  // TODO: Does the spotify lib return this sync or async? (mock should simulate the same)
  getTrack (id) {

    const mockJsonResponse = {
      popularity: 40,
      starred: true,
      album: {
        link: 'spotify:album:2rT82YYlV9UoxBYLIezkRq',
        name: 'Mock Album'
      },
      artists: [{
        link: 'spotify:artist:4svpOyfmQKuWpHLjgy4cdK',
        name: 'Mock Artist'
      }],
      duration: 1399,
      link: id,
      name: 'Mock Track Name'
    };

    return SpotifyTrackFactory.create(mockJsonResponse);
  }
};

export default SpotifyDataService;
