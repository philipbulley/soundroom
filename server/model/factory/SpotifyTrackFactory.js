var _ = require('lodash'),
  log = require('./../../util/LogUtil'),
  ProviderEnum = require('./../enum/ProviderEnum'),
  SpotifyAlbumFactory = require('./SpotifyAlbumFactory'),
  SpotifyArtistFactory = require('./SpotifyArtistFactory'),
  Track = require('./../db/Track'),
  Artist = require('./../db/Artist'),
  Album = require('./../db/Album');

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
    if (_.isArray(trackData))
      return trackData.map(function (value, i, a) {
        return SpotifyTrackFactory.create(value);
      });

    var track = {
      name: trackData.name,
      duration: trackData.duration,
      foreignId: trackData.link,
      provider: ProviderEnum.SPOTIFY,
      album: SpotifyAlbumFactory.create(trackData.album),
      artists: SpotifyArtistFactory.create(trackData.artists)
    };

    //log.debug( 'SpotifyArtistFactory.create: track:', track );

    return track;
  }

});

module.exports = SpotifyTrackFactory;
