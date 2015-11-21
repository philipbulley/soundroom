// import _ from 'lodash';
// import Q from 'q';
import FunctionUtil from './../util/FunctionUtil';
import log from './../util/LogUtil';
import Track from './../model/db/Track';
import Album from './../model/db/Album';
import Artist from './../model/db/Artist';
import ProviderEnum from './../model/enum/ProviderEnum';
import TrackErrorEnum from './../model/enum/TrackErrorEnum';
import SpotifyDataService from './../service/SpotifyDataService';
// import HttpUtil from './../util/HttpUtil';
// import Config from './../model/Config';

const spotifyDataService = new SpotifyDataService();

class TrackController {

  constructor () {
    FunctionUtil.bindAllMethods(this);

  }

  getAll () {
    console.log('TrackController.getAll()');

    return Track.findPopulateQ();
  }

  getById (id) {
    console.log('TrackController.getById()', id);

    return Track.findByIdPopulateQ(id)
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
    return Track.findPopulateQ({provider: provider, foreignId: foreignId})
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
        trackObj = spotifyDataService.getTrack(foreignId);
        break;
    }

    log.debug('TrackController.createByForeignId: Got track:', trackObj);

    // Now we have a track, ensure the individual Models are saved to the DB
    let promise = Album.findOneAndUpdateQ({foreignId: trackObj.album.foreignId}, trackObj.album, {
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
        return Artist.findOneAndUpdateQ({foreignId: artistObj.foreignId}, artistObj, {upsert: true, 'new': true});
      })
        .then((artist) => {
          log.debug('Saved Artist:', artist);
          arr[i] = artist._id;
        });
    });


    promise = promise.then(() => {
      log.debug('Call save track:', trackObj);
      const track = new Track(trackObj);
      return track.saveQ();
    })
      .then((track) => {
        return track.populateQ(Track.POPULATE_FIELDS);
      })
      .then((track) => {
        log.debug('Got saved track:', track);
        log.debug('Got saved track.album:', track.album);
        log.debug('Got saved track.artists:', track.artists);

        return track;
      });

    return promise;
  }
}

export default TrackController;
