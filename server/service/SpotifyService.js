var spotify = require('node-spotify'),
  _ = require('lodash'),
  Q = require('q'),
  FunctionUtil = require('./../util/FunctionUtil'),
  singletonBlocker = 843485732849825;


function SpotifyService(blocker) {

  FunctionUtil.bindAllMethods(this);

  console.log('SpotifyService():', blocker);
  if (blocker !== singletonBlocker)
    throw new Error('SpotifyService is to be used as a singleton. Please use SpotifyService.getInstance()');

}

_.extend(SpotifyService, {

  instance: null,

  getInstance: function () {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService(singletonBlocker);
    }



    return SpotifyService.instance;
  }

});

_.extend(SpotifyService.prototype, {

  isLoggedIn: null,

  login: function () {

    console.log('SpotifyService.login()');

    if (this.isLoggedIn) {
      return Q.when();
    }

    var deferred = Q.defer();

    // Init and overwrite
    spotify = spotify({appkeyFile: process.env.SPOTIFY_APP_KEY});

    var ready = function (err) {
      if (err) {
        console.error('Login failed for ' + process.env.SPOTIFY_USERNAME + ':', err);
        deferred.reject(err);
      }

      console.log('SpotifyService.login: Success! Logged in as:', spotify.sessionUser.displayName, '(' + spotify.sessionUser.link + ')');

      //spotify.player.play(spotify.createFromLink('spotify:track:4PLOJDcUb3gwfMLoZPQt3O'));    // DEBUG

      this.isLoggedIn = true;

      deferred.resolve(spotify.sessionUser);
    }.bind(this);

    // Add listener for login complete
    spotify.on({
      ready: ready
    });

    // DEBUG!
    //spotify.player.on({
    //  endOfTrack: function () {
    //    console.log('End of track');
    //  }
    //});


    spotify.login(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PASSWORD, false, false);

    return deferred.promise;
  },

  getTrack: function (id) {
    console.log('SpotifyService.getTrack():', id, 'spotify:', spotify);
    return spotify.createFromLink(id);
  },

  play: function (id) {
    spotify.player.play(spotify.createFromLink(id));
  },

  // http://www.node-spotify.com/api.html#search

  search: function (terms) {
    var deferred = Q.defer();
    var offset = 0;
    var limit = 10;
    var search = new spotify.Search(terms, offset, limit);
    search.execute(function(err, result) {
      if (err) {
        deferred.reject(err);
      }
      deferred.resolve(result);
    });
    return deferred.promise;
  }

});


module.exports = SpotifyService;
