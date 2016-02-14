import db from './../model/db';
import FunctionUtil from './../util/FunctionUtil';
import log from './../util/LogUtil';
import ProviderEnum from './../model/enum/ProviderEnum';
import SpotifyDataService from './../service/SpotifyDataService';
import TrackErrorEnum from './../model/enum/TrackErrorEnum';


class TrackController {

  constructor () {
    FunctionUtil.bindAllMethods(this);

    this.spotifyDataService = new SpotifyDataService();
  }

  getAll () {
    console.log('TrackController.getAll()');
    return db.Track.findPopulateQ();
  }

  getById (id) {
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
  getByForeignId (provider, foreignId) {
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
   * @param provider
   * @param foreignId
   * @returns {Q.Promise<Track>}
   */
  createByForeignId (provider, foreignId) {
    provider = provider.toLowerCase();

    let trackObj;

    switch (provider) {
      case ProviderEnum.SPOTIFY:
        trackObj = this.spotifyDataService.getTrack(foreignId);
        break;
    }

    log.debug('TrackController.createByForeignId: Got track:', trackObj);
    // Now we have a track, ensure the individual Models are saved to the DB
    let promise = db.Album.findOneAndUpdateQ({foreignId: trackObj.album.foreignId}, trackObj.album, {
      upsert: true,
      'new': true
    })
    .then((album) => {
      log.debug('Got Album:', album);
      trackObj.album = album._id;
    });

    trackObj.artists.forEach((artistObj, i, arr) => {
      promise = promise.then(() => {
        console.log('About to call Artist.findOneAndUpdateQ:', artistObj);
        return db.Artist.findOneAndUpdateQ({foreignId: artistObj.foreignId}, artistObj, {upsert: true, 'new': true});
      })
        .then((artist) => {
          log.debug('Saved Artist:', artist);
          arr[i] = artist._id;
        });
    });

    promise = promise.then(() => {
      log.debug('Call save track:', trackObj);
      const track = db.Track(trackObj);
      return track.saveQ();
    })
      .then((track) => {
        return track.populateQ(db.Track.POPULATE_FIELDS);
      })
      .then((track) => {
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
  getArtwork (id) {
    return this.getById(id)
      .then((track) => {
        switch (track.provider) {
          case ProviderEnum.SPOTIFY:
            return this.spotifyDataService.getTrackArtwork(track);
            break;
          default:
            return null;
            break;
        }
      });
  }
}

export default new TrackController();
