import _ from 'lodash';
import ProviderEnum from './../enum/ProviderEnum';


function SpotifyAlbumFactory() {

}

_.extend(SpotifyAlbumFactory, {

  /**
   * Takes album data as returned from the node-spotify API and converts it to an object that can be used when querying
   * with Mongoose (ie. The correct keys are used as per the Mongoose Models, however these are not actual Mongoose
   * Models).
   *
   * If you plan to save to the DB, you may want to check the DB for duplicate data beforehand.
   *
   * @param {array|any} albumData
   * @returns {Album[]|Album}       An array of albums or a single album, corresponding to the albumData input.
   */
  create: function (albumData) {
    if (_.isArray(albumData))
      return albumData.map((value) => SpotifyAlbumFactory.create(value));

    const album = {
      name: albumData.name,
      foreignId: albumData.link,
      provider: ProviderEnum.SPOTIFY
    };

    return album;
  }

})
;

export default SpotifyAlbumFactory;
