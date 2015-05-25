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
          {
            throw new Error( PlaylistErrorEnum.NOT_FOUND );
            return
          }

          res.json( playlist );
        } );
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
  }
};

module.exports = PlaylistController;
