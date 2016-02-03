import { EventEmitter } from 'events';
import spotify from 'node-spotify';
// import _ from 'lodash';
import Q from 'q';
import FunctionUtil from './../util/FunctionUtil';


class SpotifyService extends EventEmitter {

  spotify = null;
  isLoggedIn = false;
  currentTrack = null;

  constructor () {
    super();
    FunctionUtil.bindAllMethods(this);
  }

  login () {

    console.log('SpotifyService.login()', this.isLoggedIn);

    if (this.isLoggedIn) {
      return Q.when();
    }

    const { SPOTIFY_USERNAME, SPOTIFY_PASSWORD, SPOTIFY_APP_KEY } = process.env;

    const deferred = Q.defer();

    // Init and overwrite
    this.spotify = spotify({appkeyFile: SPOTIFY_APP_KEY});

    // Add listener for login complete
    this.spotify.on({
      ready: (err) => {
        if (err) {
          console.error(`Login failed for ${SPOTIFY_USERNAME}:`, err);
          deferred.reject(err);
        }

        const {displayName, link} = this.spotify.sessionUser;
        console.log(`SpotifyService.login: Success! Logged in as: ${displayName}, (${link})`);

        //spotify.player.play(spotify.createFromLink('spotify:track:4PLOJDcUb3gwfMLoZPQt3O'));    // DEBUG

        this.isLoggedIn = true;
        deferred.resolve(this.spotify.sessionUser);
      }
    });

    this.spotify.login(SPOTIFY_USERNAME, SPOTIFY_PASSWORD, false, false);

    return deferred.promise;
  }

  getTrack (id) {
    console.log('SpotifyService.getTrack():', id, 'spotify:', this.spotify);
    return this.spotify.createFromLink(id);
  }

  play (id) {
    this.currentTrack = this.spotify.createFromLink(id);
    this.spotify.player.on({
      endOfTrack: () => this.onEnded()
    });
    this.spotify.player.play(this.currentTrack);

    if (process.env.SKIP_TRACKS === 'true') {
      setTimeout(() => this.seek(this.getDuration() - 20), 1000);
    }

    this.onProgress();
  }

  onProgress () {
    const currentTime = this.getCurrentTime();
    const progress = this.getProgress();
    const duration = this.getDuration();

    this.emit('progress', { currentTime, duration, progress });

    if (progress < 1) {
      setTimeout(() => this.onProgress(), 900);
    }
  }

  onEnded () {
    this.emit('end');
  }

  pause () {
    this.spotify.player.pause();
  }

  resume () {
    this.spotify.player.resume();
  }

  seek (second) {
    this.spotify.player.seek(second);
  }

  getCurrentTime () {
    return this.spotify.player.currentSecond || 0;
  }

  getDuration () {
    return (this.currentTrack && this.currentTrack.duration) || 1;
  }

  getProgress () {
    return this.getCurrentTime() / this.getDuration();
  }

  // http://www.node-spotify.com/api.html#search

  search (terms) {
    const deferred = Q.defer();
    const offset = 0;
    const limit = 10;
    const spotiSearch = new this.spotify.Search(terms, offset, limit);
    spotiSearch.execute((err, result) => {
      if (err) {
        deferred.reject(err);
      }
      deferred.resolve(result);
    });
    return deferred.promise;
  }

  getImage (albumLink) {
    const album = this.spotify.createFromLink(albumLink);

    function fetchImage(tries, cb) {
      console.log('fetchImage', tries);
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
}

export default new SpotifyService();
