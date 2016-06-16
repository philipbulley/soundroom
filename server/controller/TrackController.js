import db from './../model/db';
import FunctionUtil from './../util/FunctionUtil';
import log from './../util/LogUtil';
import Q from 'q';
import ProviderEnum from './../model/enum/ProviderEnum';
import SpotifyDataService from './../service/SpotifyDataService';
import TrackErrorEnum from './../model/enum/TrackErrorEnum';


class TrackController {

  constructor() {
    FunctionUtil.bindAllMethods(this);

    this.spotifyDataService = new SpotifyDataService();
  }

  getAll() {
    console.log('TrackController.getAll()');
    return db.Track.findPopulateQ();
  }

  getById(id) {
    console.log('TrackController.getById()', id);

    return db.Track.findByIdPopulateQ(id)
      .then((track) => {
        if (!track)
          throw new Error(TrackErrorEnum.NOT_FOUND);

        return track;
      });
  }

  /**
   * Gets a track based on it's foreign ID
   *
   * @param {string} provider     Use a value that exists in ProviderEnum
   * @param {string} foreignId    The ID on the provider's platform
   */
  getByForeignId(provider, foreignId) {
    return db.Track.findPopulateQ({provider: provider, foreignId: foreignId})
      .then((tracks) => {
        if (!tracks || !tracks.length)
          throw new Error(TrackErrorEnum.NOT_FOUND);

        return tracks[0];
      });
  }

  /**
   * Creates a track based on the foreignId then saves it to the database.
   *
   * @param {User} user
   * @param {string} provider
   * @param {string} foreignId
   * @returns {Q.Promise<Track>}
   */
  createByForeignId(user, provider, foreignId) {
    provider = provider.toLowerCase();

    let trackObj, promise;

    switch (provider) {
      case ProviderEnum.SPOTIFY:
        promise = this.spotifyDataService.getTrack(foreignId);
        break;

      default:
        throw new Error('Provider not supported: ', provider);
    }

    // Now we have a track, ensure the individual Models are saved to the DB
    promise = promise.then(_trackObj => {
      trackObj = _trackObj;

      log.debug('TrackController.createByForeignId: Got track:', trackObj);

      return db.Album.findOneAndUpdateQ({foreignId: trackObj.album.foreignId}, trackObj.album, {
        upsert: true,
        'new': true
      })
    })
      .then(album => {
        log.debug('Got Album:', album);
        trackObj.album = album._id;

        // Get/upsert all artists
        let artistsPromise = Q.resolve();

        trackObj.artists.forEach((artistObj, i, arr) => {
            console.log('About to call Artist.findOneAndUpdateQ:', artistObj);
          artistsPromise = artistsPromise.then(() => {
            return db.Artist.findOneAndUpdateQ({foreignId: artistObj.foreignId}, artistObj, {
              upsert: true,
              'new': true
            });
          })
            .then(artist => {
              log.debug('Saved Artist:', artist);
              arr[i] = artist._id;
            });
        });

        return artistsPromise;
      })
      .then(() => {
        log.debug('Call save track:', trackObj);
        trackObj.createdBy = user._id;

        const track = db.Track(trackObj);
        return track.saveQ();
      })
      .then(track => {
        return track.populateQ(db.Track.POPULATE_FIELDS);
      })
      .then(track => {
        log.debug('Got saved track:', track);
        log.debug('Got saved track.album:', track.album);
        log.debug('Got saved track.artists:', track.artists);

        return track;
      });

    return promise;
  }

  /**
   * Get artwork for a track
   *
   * @param id
   * @returns {Q.Promise<String>}
   */
  getArtwork(id) {
    return this.getById(id)
      .then((track) => {
        switch (track.provider) {
          case ProviderEnum.SPOTIFY:
            return this.spotifyDataService.getTrackArtwork(track.foreignId);
            break;
          default:
            return null;
            break;
        }
      });
  }
}

export default new TrackController();
