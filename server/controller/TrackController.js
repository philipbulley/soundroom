var _                  = require( 'lodash' ),
    Q                  = require( 'q' ),
    FunctionUtil       = require( './../util/FunctionUtil' ),
    log                = require( './../util/LogUtil' ),
    Track              = require( './../model/db/Track' ),
    ProviderEnum       = require( './../model/enum/ProviderEnum' ),
    SpotifyDataService = require( './../service/SpotifyDataService' ),
    HttpUtil           = require( './../util/HttpUtil' ),
    Config             = require( './../model/Config' );

function TrackController()
{
  FunctionUtil.bindAllMethods( this );
}

_.extend( TrackController, {} );

TrackController.prototype = {
  getAll: function()
  {
    console.log( 'TrackController.getAll()' );

    return Track.findPopulateQ();
  },

  getById: function( id )
  {
    console.log( 'TrackController.getById()', id );

    return Track.findByIdPopulateQ( id )
        .then( function( track )
        {
          if( !track )
            throw new Error( TrackErrorEnum.NOT_FOUND );

          res.json( track );
        } );
  },

  getByForeignId: function( foreignId )
  {
    return Track.findPopulateQ( { foreignId: foreignId } )
        .then( function( track )
        {
          if( !track )
            throw new Error( TrackErrorEnum.NOT_FOUND );

          res.json( track );
        } );
  },

  /**
   * Creates a track based on the foreignId then saves it to the database.
   *
   * @param provider
   * @param foreignId
   * @returns {Q.Promise<Track>}
   */
  createByForeignId: function( provider, foreignId )
  {
    provider = provider.toLowerCase();

    var track;

    switch( provider )
    {
      case ProviderEnum.SPOTIFY:
        track = SpotifyDataService.getTrack( foreignId );
        break
    }

    // Now we have a track, ensure the individual Models are saved to the DB
    var promise = Album.findOneAndUpdateQ( { foreignId: track.album.foreignId }, track.album, { upsert: true } )
        .then( function( album )
        {
          track.album = album._id;
        } );

    track.artists.forEach( function( artist, i, arr )
    {
      promise = promise.then( function()
      {
        return Artist.findOneAndUpdateQ( { foreignId: artist.foreignId }, artist, { upsert: true } );
      } )
          .then( function( _artist )
          {
            arr.artists[ i ] = _artist._id;
          } );
    } );

    promise = promise.then( function()
    {
      return track.saveQ();
    } );

    return promise;
  }
};

module.exports = TrackController;
