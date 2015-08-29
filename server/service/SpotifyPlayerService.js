var /*Spotify      = require( './../node_modules/node-spotify/build/Release/spotify' ),*/
  _ = require('lodash'),
//Q            = require( 'q' ),
  FunctionUtil = require('./../util/FunctionUtil');


function SpotifyPlayerService() {
  console.log('SpotifyPlayerService()');

  FunctionUtil.bindAllMethods(this);

  //if( !process.env.SPOTIFY_APP_KEY || !process.env.SPOTIFY_USERNAME || !process.env.SPOTIFY_PASSWORD )
  //  throw new Error( 'Please run this app with the correct env vars set. See README.md for info on creating start.sh script.' );

  //console.log( 'Spotify: ' + Spotify );
  console.log('process.env.SPOTIFY_APP_KEY: ' + process.env.SPOTIFY_APP_KEY);

  //this.spotify = Spotify( {
  //  appkeyFile:     process.env.SPOTIFY_APP_KEY || './spotify_appkey.key',
  //  settingsFolder: 'settings',
  //  cacheFolder:    'cache',
  //  traceFile:      'trace.txt'
  //} );

  // TODO: Why doesn't this like being assigned to `this.spotify`?
  var spotify = require('./.././build/Release/spotify')({appkeyFile: process.env.SPOTIFY_APP_KEY});
  var ready = function (err) {
    if (err)
      console.log('Login failed for ' + process.env.SPOTIFY_USERNAME + ':', err);

    console.log('Ready!', spotify.sessionUser);
    //var starredPlaylist = spotify.sessionUser.starredPlaylist;
    //console.log( 'starredPlaylist:', starredPlaylist );
    //spotify.player.play( starredPlaylist.getTrack( 0 ) );

    //var offset = 0;
    //var limit = 10;
    //var search = new spotify.Search( 'nero', offset, limit );
    //var foundTracks;
    //search.execute( function( err, searchResult )
    //{
    //  //foundTracks = searchResult.tracks;
    //  console.log( 'searchResult.getTracks(0): ', searchResult.getTrack( 0 ) );
    //
    //  spotify.player.play( searchResult.getTrack( 0 ) );
    //} );

    spotify.player.play(spotify.createFromLink('spotify:track:4PLOJDcUb3gwfMLoZPQt3O'));
  };
  spotify.on({
    ready: ready
  });

  spotify.player.on({
    endOfTrack: function () {
      console.log('End of track');
    }
  });
  // TODO: Move connection to SpotifyService
  spotify.login(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PASSWORD, false, false);
}

_.extend(SpotifyPlayerService, {

  spotify: null,

  startDemo: function () {
    console.log('SpotifyPlayerService.startDemo()');

    this.spotify.on({
      ready: this.readyDemo
    });

    this.spotify.player.on({
      endOfTrack: this.endOfTrackDemo
    });

    console.log('Attempt Spotify login as ' + process.env.SPOTIFY_USERNAME);
    this.spotify.login(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PASSWORD, false, false);
  },

  readyDemo: function (err) {
    console.log('SpotifyPlayerService.readyDemo()');

    if (err)
      console.log('Login failed for ' + process.env.SPOTIFY_USERNAME + ':', err);

    console.log('Ready!', this.spotify.sessionUser);
    //var starredPlaylist = spotify.sessionUser.starredPlaylist;
    //console.log( 'starredPlaylist:', starredPlaylist );
    //spotify.player.play( starredPlaylist.getTrack( 0 ) );

    //var offset = 0;
    //var limit = 10;
    //var search = new spotify.Search( 'nero', offset, limit );
    //var foundTracks;
    //search.execute( function( err, searchResult )
    //{
    //  //foundTracks = searchResult.tracks;
    //  console.log( 'searchResult.getTracks(0): ', searchResult.getTrack( 0 ) );
    //
    //  spotify.player.play( searchResult.getTrack( 0 ) );
    //} );

    this.spotify.player.play(spotify.createFromLink('spotify:track:4PLOJDcUb3gwfMLoZPQt3O'));
  },

  endOfTrackDemo: function () {
    console.log('SpotifyPlayerService.endOfTrackDemo()');
  }

});


module.exports = SpotifyPlayerService;