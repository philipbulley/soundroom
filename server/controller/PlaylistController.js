var _                 = require( 'lodash' ),
    Q                 = require( 'q' ),
    FunctionUtil      = require( './../util/FunctionUtil' ),
    log               = require( './../util/LogUtil' ),
    Playlist          = require( './../model/db/Playlist' ),
    TrackController   = require( './TrackController' ),
    PlaylistErrorEnum = require( './../model/enum/PlaylistErrorEnum' ),
    Config            = require( './../model/Config' );

function PlaylistController()
{
  FunctionUtil.bindAllMethods( this );

  this.trackController = new TrackController();
}

_.extend( PlaylistController, {} );

PlaylistController.prototype = {
  trackController: null,

  getAll: function()
  {
    console.log( 'PlaylistController.getAll()' );

    return Playlist.findPopulateQ();
  },

  getById: function( id )
  {
    console.log( 'PlaylistController.getById()', id );

    return Playlist.findByIdPopulateQ( id )
        .then( function( playlist )
        {
          if( !playlist )
            throw new Error( PlaylistErrorEnum.NOT_FOUND );

          return playlist;
        } )
        .catch( function( err )
        {
          if( err.message !== PlaylistErrorEnum.INVALID_ID && err.message !== PlaylistErrorEnum.NOT_FOUND )
            log.formatError( err, 'PlaylistController.getById' );

          // Rethrow
          throw err;
        }.bind( this ) );
  },

  create: function( name, description, user )
  {
    var playlist = new Playlist();
    playlist.name = name;
    playlist.description = description;
    playlist.createdBy = user;

    return playlist.saveQ();
  },

  addTrackByForeignId: function( provider, foreignId )
  {
    // TODO: Implement and test invalid id
    //if( !Playlist.isValidId( id ) )
    //  return Q.reject( new Error( PlaylistErrorEnum.INVALID_ID ) );


    // Check if track exists as a Track model
    this.trackController.getByForeignId( foreignId )
        .then( function( track )
        {
          if( !track )
            return this.trackController.createByForeignId( provider, foreignId );

          return track;
        } )
        .then( function( track )
        {
          console.log( 'PlaylistController.addTrackByForeignId()', track );
          return track;
          // TODO: ensure track doesn't exist in Playlist.tracks, if not in, create PlaylistTrack & add upvote
        } );
  },

  upVoteTrack: function( req, res )
  {
    return Playlist.findByIdPopulateQ( req.params.playlist_id )
        .then( function( playlist )
        {
          // TODO: Search for PlaylistTrack, add vote, send change via socket
        } );
  },

  /**
   * Updates the playlist with id with the key/values in the updateObj
   *
   * @param id            The id of the playlist
   * @param updateObj     These should be pre-sanitized before passing
   */
  updateById: function( id, updateObj )
  {
    return Playlist.findByIdPopulateQ( id )
        .then( function( playlist )
        {
          if( !playlist )
            throw new Error( PlaylistErrorEnum.NOT_FOUND );

          // Not sanitizing update keys, this should be done before
          for( var key in updateObj )
            playlist[ key ] = updateObj[ key ];

          return playlist.savePopulateQ();
        } )
        .catch( function( err )
        {
          if( err.message !== PlaylistErrorEnum.INVALID_ID && err.message !== PlaylistErrorEnum.NOT_FOUND )
            log.formatError( err, 'PlaylistController.updateById' );

          // Rethrow
          throw err;
        }.bind( this ) );
  },

  deleteById: function( id )
  {
    log.debug( 'PlaylistController.deleteByIdParam', id );

    if( !Playlist.isValidId( id ) )
      return Q.reject( new Error( PlaylistErrorEnum.INVALID_ID ) );

    return Playlist.findByIdAndRemoveQ( id )
        .then( function( playlist )
        {
          if( !playlist )
            throw new Error( PlaylistErrorEnum.NOT_FOUND );
          else
            return playlist;
        } )
        .catch( function( err )
        {
          if( err.message !== PlaylistErrorEnum.NOT_FOUND )
            log.formatError( err, 'PlaylistController.updateById' );

          // Rethrow
          throw err;
        }.bind( this ) );
  }
};

module.exports = PlaylistController;
