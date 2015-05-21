var _            = require( 'lodash' ),
    Q            = require( 'q' ),
    FunctionUtil = require( './../util/FunctionUtil' ),
    log          = require( './../util/LogUtil' ),
    Track        = require( './../model/db/Track' ),
    //PermissionErrorEnum = require( './../model/enum/PermissionErrorEnum' ),
    HttpUtil     = require( './../util/HttpUtil' ),
    Config       = require( './../model/Config' );

function TrackController()
{
  FunctionUtil.bindAllMethods( this );
}

_.extend( TrackController, {

  getAll: function( req, res )
  {
    console.log( 'TrackController.getAll()' );

    return Track.findPopulateQ()
        .then( function( tracks )
        {
          // If no tracks, return empty array, not a 404
          res.json( tracks );
        } )
        .catch( function( err )
        {
          if( err.message.toLowerCase().indexOf( 'break' ) === 0 )
          {
            // Simply aborting the promise chain, not an error
          }
          else
          {
            HttpUtil.sendJsonError( res, HttpUtil.status.INTERNAL_SERVER_ERROR );
            log.formatError( err, 'TrackController.get' );
          }
        }.bind( this ) );
  },

  getByIdParam: function( req, res )
  {
    console.log( 'TrackController.getByIdParam()', req.params.track_id );

    return Track.findByIdPopulateQ( req.params.track_id )
        .then( function( track )
        {
          if( !track )
          {
            HttpUtil.sendJsonError( res, HttpUtil.status.NOT_FOUND );
            return
          }

          res.json( track );
        } )
        .catch( function( err )
        {
          if( err.message.toLowerCase().indexOf( 'break' ) === 0 )
          {
            // Simply aborting the promise chain, not an error
          }
          else
          {
            HttpUtil.sendJsonError( res, HttpUtil.status.INTERNAL_SERVER_ERROR );
            log.formatError( err, 'TrackController.get' );
          }
        }.bind( this ) );
  },

  findByForeignId: function( provider, foreignId )
  {
    return Track.findPopulateQ( { provider: provider, foreignId: foreignId } );
  },

  create: function( req, res )
  {
    var track = new Track();
    track.title = req.body.name;
    track.description = req.body.description;
    track.createdBy = req.user;

    return track.saveQ()
        .then( function( track )
        {
          res.json( track );
        }.bind( this ) )
        .catch( function( err )
        {
          log.formatError( err, 'TrackController.create: save' );
        }.bind( this ) );
  },

  upVoteTrack: function( req, res )
  {
    return Track.findByIdPopulateQ( req.params.track_id )
        .then( function( track )
        {
          // TODO: Search for TrackTrack, add vote, send change via socket
        } );
  }

} );

TrackController.prototype = {};

module.exports = TrackController;
