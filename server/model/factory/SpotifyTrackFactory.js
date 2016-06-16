import _ from 'lodash';
import ProviderEnum from './../enum/ProviderEnum';
import SpotifyAlbumFactory from './SpotifyAlbumFactory';
import SpotifyArtistFactory from './SpotifyArtistFactory';

function SpotifyTrackFactory() {

}

_.extend(SpotifyTrackFactory, {

  /**
   * Takes track data as returned from the node-spotify API and converts it to an object that can be used when querying
   * with Mongoose (ie. The correct keys are used as per the Mongoose Models, however these are not actual Mongoose
   * Models).
   *
   * If you plan to save to the DB, you may want to check the DB for duplicate data beforehand.
   *
   * @param {object|array|any} trackData  JSON formatted response from the libspotify API
   * @returns {Track[]|Track}       An array of tracks or a single track, corresponding to the trackData input.
   */
  create: function (trackData) {
    if (_.isArray(trackData)) {
      return trackData.map((value) => SpotifyTrackFactory.create(value));
    }

    const track = {
      name: trackData.name,
      duration: trackData.duration,
      foreignId: trackData.link,
      provider: ProviderEnum.SPOTIFY,
      album: SpotifyAlbumFactory.create(trackData.album),
      artists: SpotifyArtistFactory.create(trackData.artists),
      images: trackData.images
    };

    //log.debug( 'SpotifyArtistFactory.create: track:', track );

    return track;
  }

});

export default SpotifyTrackFactory;
