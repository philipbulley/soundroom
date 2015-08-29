var _                  = require( 'lodash' ),
    Q                  = require( 'q' ),
    FunctionUtil       = require( './../util/FunctionUtil' ),
    log                = require( './../util/LogUtil' ),
    Track              = require( './../model/db/Track' ),
    Album              = require( './../model/db/Album' ),
    Artist             = require( './../model/db/Artist' ),
    ProviderEnum       = require( './../model/enum/ProviderEnum' ),
    TrackErrorEnum     = require( './../model/enum/TrackErrorEnum' ),
    SpotifyDataService = require( './../service/SpotifyDataService' ),
    HttpUtil           = require( './../util/HttpUtil' ),
    Config             = require( './../model/Config' );

function TrackController()
{
  FunctionUtil.bindAllMethods( this );
}

_.extend( TrackController, {} );

TrackController.prototype = {

  spotifyDataService: new SpotifyDataService(),

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

          return track;
        }.bind( this ) );
  },

  /**
   * Gets a track based on it's foreign ID
   *
   * @param {string} provider     Use a value that exists in ProviderEnum
   * @param {string} foreignId    The ID on the provider's platform
   */
  getByForeignId: function( provider, foreignId )
  {
    return Track.findPopulateQ( { provider: provider, foreignId: foreignId } )
        .then( function( tracks )
        {
          if( !tracks || !tracks.length )
            throw new Error( TrackErrorEnum.NOT_FOUND );

          return tracks[ 0 ];
        }.bind( this ) );
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

    var trackObj;

    switch( provider )
    {
      case ProviderEnum.SPOTIFY:
        trackObj = this.spotifyDataService.getTrack( foreignId );
        break
    }

    log.debug( 'TrackController.createByForeignId: Got track:', trackObj );

    // Now we have a track, ensure the individual Models are saved to the DB
    var promise = Album.findOneAndUpdateQ( { foreignId: trackObj.album.foreignId }, trackObj.album, { upsert: true, 'new': true } )
        .then( function( album )
        {
          log.debug( 'Got Album:', album );
          trackObj.album = album._id;
        }.bind( this ) );

    trackObj.artists.forEach( function( artistObj, i, arr )
    {
      promise = promise.then( function()
      {
        console.log( 'About to call Artist.findOneAndUpdateQ:', artistObj );
        return Artist.findOneAndUpdateQ( { foreignId: artistObj.foreignId }, artistObj, { upsert: true, 'new': true } );
      }.bind( this ) )
          .then( function( artist )
          {
            log.debug( 'Saved Artist:', artist );
            arr[ i ] = artist._id;
          }.bind( this ) );
    } );


    promise = promise.then( function()
    {
      log.debug( 'Call save track:', trackObj );
      var track = new Track( trackObj );
      return track.saveQ();
    }.bind( this ) )
        .then( function( track )
        {
          return track.populateQ( Track.POPULATE_FIELDS );
        }.bind( this ) )
        .then( function( track )
        {
          log.debug( 'Got saved track:', track );
          log.debug( 'Got saved track.album:', track.album );
          log.debug( 'Got saved track.artists:', track.artists );

          return track;
        }.bind( this ) );

    return promise;
  }
};

module.exports = TrackController;
