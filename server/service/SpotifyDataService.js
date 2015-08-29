var _ = require('lodash'),
  log = require('./../util/LogUtil'),
//Q            = require( 'q' ),
  FunctionUtil = require('./../util/FunctionUtil'),
  SpotifyService = require('./SpotifyService'),
  SpotifyTrackFactory = require('./../model/factory/SpotifyTrackFactory');


function SpotifyDataService() {

  FunctionUtil.bindAllMethods(this);

  this.spotifyService = SpotifyService.getInstance();
  this.spotifyService.login();
}

_.extend(SpotifyDataService, {});

SpotifyDataService.prototype = {

  spotifyService: null,

  getTrack: function (id) {
    //console.log('SpotifyDataService.getTrack():', id, 'spotifyService:', this.spotifyService);

    var trackResponse = this.spotifyService.getTrack(id);
    console.log('SpotifyDataService.getTrack: trackResponse:', trackResponse);
    return SpotifyTrackFactory.create(trackResponse);
  }

};


///////////////////////////////////////////////////


function MockSpotifyDataService() {
  FunctionUtil.bindAllMethods(this);
}

_.extend(MockSpotifyDataService, {});

MockSpotifyDataService.prototype = {

  spotifyService: null,

  // TODO: Does the spotify lib return this sync or async? (mock should simulate the same)
  getTrack: function (id) {
    var mockJsonResponse = {
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

    var track = SpotifyTrackFactory.create(mockJsonResponse);

    return track;
  }
};


if (process.env.MOCK_SPOTIFY === 'true')
  module.exports = MockSpotifyDataService;
else
  module.exports = SpotifyDataService;
