var _            = require( 'lodash' ),
    ProviderEnum = require( './../enum/ProviderEnum' ),
    Artist       = require( './../db/Artist' );

function SpotifyArtistFactory()
{

}

_.extend( SpotifyArtistFactory, {

  /**
   * Takes artist data as returned from the node-spotify API and converts it to a local Mongoose model(s).
   *
   * If you plan to save to the DB, you may want to check the DB for duplicate data beforehand.
   *
   * @param {array|any} artistData
   * @returns {Artist[]|Artist}       An array of artists or a single artist, corresponding to the artistData input.
   */
  create: function( artistData )
  {
    if( _.isArray( artistData ) )
      return artistData.map( function( value, i, a )
      {
        SpotifyArtistFactory.create( value );
      } );

    var artist = new Artist();
    artist.name = artistData.name;
    artist.foreignId = artistData.link;
    artist.provider = ProviderEnum.SPOTIFY;

    return artist;
  }

} );

module.exports = SpotifyArtistFactory;
