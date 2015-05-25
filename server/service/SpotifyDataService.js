var _                   = require( 'lodash' ),
    //Q            = require( 'q' ),
    FunctionUtil        = require( './../util/FunctionUtil' ),
    SpotifyTrackFactory = require( './../model/factory/SpotifyTrackFactory' );


function SpotifyDataService()
{
  this.spotifyService = SpotifyService.getInstance();
}

_.extend( SpotifyDataService, {} );

SpotifyDataService.prototype = {

  spotifyService: null,

  getTrack: function( id )
  {
    return this.spotify.createFromLink( 'spotify:track:05JqOBN6XW4eFUVQlgR0I3' );
  }

};


///////////////////////////////////////////////////


function MockSpotifyDataService()
{
}

_.extend( MockSpotifyDataService, {} );

MockSpotifyDataService.prototype = {
  spotifyService: null,

  getTrack: function( id )
  {
    var response = {
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

    var track = SpotifyTrackFactory.create( response );

    return track;
  }
};


if( process.env.MOCK_SPOTIFY )
  module.exports = MockSpotifyDataService;
else
  module.exports = SpotifyDataService;
