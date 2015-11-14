var spotify = require('node-spotify'),
  _ = require('lodash'),
  Q = require('q'),
  FunctionUtil = require('./../util/FunctionUtil');

const singletonBlocker = 843485732849825;


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

  isLoggedIn: false,

  login: function () {

    console.log('SpotifyService.login()');

    if (this.isLoggedIn) {
      return Q.when();
    }

    const deferred = Q.defer();

    // Init and overwrite
    spotify = spotify({appkeyFile: process.env.SPOTIFY_APP_KEY});

    // Add listener for login complete
    spotify.on({
      ready: (err) => {
        if (err) {
          console.error(`Login failed for ${process.env.SPOTIFY_USERNAME}:`, err);
          deferred.reject(err);
        }

        const {displayName, link} = spotify.sessionUser;
        console.log(`SpotifyService.login: Success! Logged in as: ${displayName}, (${link})`);

        //spotify.player.play(spotify.createFromLink('spotify:track:4PLOJDcUb3gwfMLoZPQt3O'));    // DEBUG

        this.isLoggedIn = true;
        deferred.resolve(spotify.sessionUser);
      }
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

  getTrack (id) {
    console.log('SpotifyService.getTrack():', id, 'spotify:', spotify);
    return spotify.createFromLink(id);
  },

  play (id) {
    spotify.player.play(spotify.createFromLink(id));
  },

  // http://www.node-spotify.com/api.html#search

  search (terms) {
    const deferred = Q.defer();
    const offset = 0;
    const limit = 10;
    const search = new spotify.Search(terms, offset, limit);
    search.execute((err, result) => {
      if (err) {
        deferred.reject(err);
      }
      deferred.resolve(result);
    });
    return deferred.promise;
  },

  getImage (albumLink) {
    const album = spotify.createFromLink(albumLink);

    function fetchImage(tries, cb) {
      if (tries === 0) {
        return cb('Can\'t get cover image', null);
      }
      const image = album.getCoverBase64();
      if (image) {
        return cb(null, `data:image/jpeg;base64,${image}`);
      }
      tries--;
      setTimeout(() => fetchImage(tries, cb), 100);
    }

    const deferred = Q.defer();

    fetchImage(10, (err, result) => {
      if (err) {
        deferred.reject(err);
      }
      deferred.resolve(result);
    });

    return deferred.promise;
  }
});


module.exports = SpotifyService;
