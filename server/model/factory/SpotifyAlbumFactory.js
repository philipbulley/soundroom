var _            = require( 'lodash' ),
    ProviderEnum = require( './../enum/ProviderEnum' ),
    Album        = require( './../db/Album' );

function SpotifyAlbumFactory()
{

}

_.extend( SpotifyAlbumFactory, {

  /**
   * Takes album data as returned from the node-spotify API and converts it to a local Mongoose model(s).
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

    var album = new Album();
    album.name = albumData.name;
    album.foreignId = albumData.link;
    album.provider = ProviderEnum.SPOTIFY;

    return album;
  }

} );

module.exports = SpotifyAlbumFactory;
