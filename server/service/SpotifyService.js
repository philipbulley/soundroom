var /*Spotify      = require( './../node_modules/node-spotify/build/Release/spotify' ),*/
    _                = require( 'lodash' ),
    //Q            = require( 'q' ),
    FunctionUtil     = require( './../util/FunctionUtil' ),
    singletonBlocker = 843485732849825;


function SpotifyService( blocker )
{
  if( blocker !== singletonBlocker )
    throw new Error( 'SpotifyService is to be used as a singleton. Please use SpotifyService.getInstance()' );

  // TODO: Connect directly to spotify
}

_.extend( SpotifyService, {

  instance: null,

  getInstance: function()
  {
    if( !SpotifyService.instance )
      SpotifyService.instance = new SpotifyService( singletonBlocker );

    return SpotifyService.instance;
  }

} );

_.extend( SpotifyService.prototype, {

  spotify: null,


  getTrack: function( id )
  {
    return this.spotify.createFromLink( 'spotify:track:05JqOBN6XW4eFUVQlgR0I3' );
  }

} );


module.exports = SpotifyService;
