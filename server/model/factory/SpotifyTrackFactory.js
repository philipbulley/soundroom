var _                    = require( 'lodash' ),
    ProviderEnum         = require( './../enum/ProviderEnum' ),
    SpotifyAlbumFactory  = require( './SpotifyAlbumFactory' ),
    SpotifyArtistFactory = require( './SpotifyArtistFactory' ),
    Track                = require( './../db/Track' ),
    Artist               = require( './../db/Artist' ),
    Album                = require( './../db/Album' );

function SpotifyTrackFactory()
{

}

_.extend( SpotifyTrackFactory, {

  /**
   * Takes track data as returned from the node-spotify API and converts it to a local Mongoose model(s).
   *
   * If you plan to save to the DB, you may want to check the DB for duplicate data beforehand.
   *
   * @param {array|any} trackData
   * @returns {Track[]|Track}       An array of tracks or a single track, corresponding to the trackData input.
   */
  create: function( trackData )
  {
    if( _.isArray( trackData ) )
      return trackData.map( function( value, i, a )
      {
        SpotifyTrackFactory.create( value );
      } );

    var track = new Track();
    track.name = trackData.name;
    track.duration = trackData.duration;
    track.foreignId = trackData.link;
    track.provider = ProviderEnum.SPOTIFY;
    track.album = SpotifyAlbumFactory.create( trackData.album );
    track.artists = SpotifyArtistFactory.create( trackData.artists );

    return track;
  }

} );

module.exports = SpotifyTrackFactory;
