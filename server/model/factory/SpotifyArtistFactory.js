var _            = require( 'lodash' ),
    log          = require( './../../util/LogUtil' ),
    ProviderEnum = require( './../enum/ProviderEnum' ),
    Artist       = require( './../db/Artist' );

function SpotifyArtistFactory()
{

}

_.extend( SpotifyArtistFactory, {

  /**
   * Takes artist data as returned from the node-spotify API and and converts it to an object that can be used when
   * querying with Mongoose (ie. The correct keys are used as per the Mongoose Models, however these are not actual
   * Mongoose Models).
   *
   * If you plan to save to the DB, you may want to check the DB for duplicate data beforehand.
   *
   * @param {array|any} artistData
   * @returns {Artist[]|Artist}       An array of artists or a single artist, corresponding to the artistData input.
   */
  create: function( artistData )
  {
    log.debug( 'SpotifyArtistFactory.create():', artistData );

    if( _.isArray( artistData ) )
      return artistData.map( function( value, i, a )
      {
        return SpotifyArtistFactory.create( value );
      } );

    var artist = {
      name: artistData.name,
      foreignId: artistData.link,
      provider: ProviderEnum.SPOTIFY
    };

    //log.debug( 'SpotifyArtistFactory.create: returning: ', artist );

    return artist;
  }

} );

module.exports = SpotifyArtistFactory;
