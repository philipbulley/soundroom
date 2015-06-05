var _            = require( 'lodash' ),
    log          = require( './../../util/LogUtil' ),
    ProviderEnum = require( './../enum/ProviderEnum' ),
    Album        = require( './../db/Album' );

function SpotifyAlbumFactory()
{

}

_.extend( SpotifyAlbumFactory, {

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
  create: function( albumData )
  {
    if( _.isArray( albumData ) )
      return albumData.map( function( value, i, a )
      {
        SpotifyAlbumFactory.create( value );
      } );

    var album = {
      name: albumData.name,
      foreignId: albumData.link,
      provider: ProviderEnum.SPOTIFY
    };

    return album;
  }

} )
;

module.exports = SpotifyAlbumFactory;
