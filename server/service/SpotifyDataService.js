var _                   = require( 'lodash' ),
    log                 = require( './../util/LogUtil' ),
    //Q            = require( 'q' ),
    FunctionUtil        = require( './../util/FunctionUtil' ),
    SpotifyService      = require( './SpotifyService' ),
    SpotifyTrackFactory = require( './../model/factory/SpotifyTrackFactory' );


function SpotifyDataService()
{
  this.spotifyService = SpotifyService.getInstance();
}

_.extend( SpotifyDataService, {} );

SpotifyDataService.prototype = {

  spotifyService: null,

  // TODO: Does the spotify lib return this sync or async?
  getTrack: function( id )
  {
    var trackResponse = this.spotify.createFromLink( 'spotify:track:05JqOBN6XW4eFUVQlgR0I3' );
    return SpotifyTrackFactory.create( trackResponse )
  }

};


///////////////////////////////////////////////////


function MockSpotifyDataService()
{
}

_.extend( MockSpotifyDataService, {} );

MockSpotifyDataService.prototype = {

  spotifyService: null,

  // TODO: Does the spotify lib return this sync or async? (mock should simulate the same)
  getTrack: function( id )
  {
    var mockJsonResponse = {
      popularity: 40,
      starred: true,
      album: {
        link: 'spotify:album:2rT82YYlV9UoxBYLIezkRq',
        name: 'Mock Album'
      },
      artists: [ {
        link: 'spotify:artist:4svpOyfmQKuWpHLjgy4cdK',
        name: 'Mock Artist'
      } ],
      duration: 1399,
      link: id,
      name: 'Mock Track Name'
    };

    var track = SpotifyTrackFactory.create( mockJsonResponse );

    return track;
  }
};


if( process.env.MOCK_SPOTIFY )
  module.exports = MockSpotifyDataService;
else
  module.exports = SpotifyDataService;
