var _               = require( 'lodash' ),
    Q               = require( 'q' ),
    FunctionUtil    = require( './../util/FunctionUtil' ),
    log             = require( './../util/LogUtil' ),
    Playlist        = require( './../model/db/Playlist' ),
    TrackController = require( './TrackController' ),
    //PermissionErrorEnum = require( './../model/enum/PermissionErrorEnum' ),
    HttpUtil        = require( './../util/HttpUtil' ),
    Config          = require( './../model/Config' );

function PlaylistController()
{
  FunctionUtil.bindAllMethods( this );
}

_.extend( PlaylistController, {

  trackController: new TrackController(),

  getAll: function( req, res )
  {
    console.log( 'PlaylistController.getAll()' );

    return Playlist.findPopulateQ()
        .then( function( playlists )
        {
          // If no playlists, return empty array, not a 404
          res.json( playlists );
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
            log.formatError( err, 'PlaylistController.get' );
          }
        }.bind( this ) );
  },

  getByIdParam: function( req, res )
  {
    console.log( 'PlaylistController.getByIdParam()', req.params.playlist_id );

    return Playlist.findByIdPopulateQ( req.params.playlist_id )
        .then( function( playlist )
        {
          if( !playlist )
          {
            HttpUtil.sendJsonError( res, HttpUtil.status.NOT_FOUND );
            return
          }

          res.json( playlist );
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
            log.formatError( err, 'PlaylistController.get' );
          }
        }.bind( this ) );
  },

  create: function( req, res )
  {
    var playlist = new Playlist();
    playlist.title = req.body.name;
    playlist.description = req.body.description;
    playlist.createdBy = req.user;

    return playlist.saveQ()
        .then( function( playlist )
        {
          res.json( playlist );
        }.bind( this ) )
        .catch( function( err )
        {
          log.formatError( err, 'PlaylistController.create: save' );
        }.bind( this ) );
  },

  addTrack: function( req, res )
  {
    // Check if track exists as a Track model
    this.trackController.findByForeignId( req.params.track_id )
        .then(function(track){
          // TODO: if track exists, if not create track
          // TODO: ensure track doesn't exist in Playlist.tracks, if not in, create PlaylistTrack & add upvote
        })
  },

  upVoteTrack: function( req, res )
  {
    return Playlist.findByIdPopulateQ( req.params.playlist_id )
        .then( function( playlist )
        {
          // TODO: Search for PlaylistTrack, add vote, send change via socket
        } );
  }

} );

PlaylistController.prototype = {};

module.exports = PlaylistController;
