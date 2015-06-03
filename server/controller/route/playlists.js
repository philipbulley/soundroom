var express                   = require( 'express' ),
    router                    = express.Router(),
    PlaylistRequestController = require( './../request/PlaylistRequestController' ),
    //AuthController = require( './../AuthController' ),
    //PermissionEnum = require( './../../model/enum/PermissionEnum' ),
    log                       = require( './../../util/LogUtil' );

router.route( '/' )
    .get( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'GET /playlists/' );

      new PlaylistRequestController()
          .getAll( req, res )
          .done();
    } )

    .post( /*AuthController.verify(),*/
    function( req, res )
    {
      new PlaylistRequestController()
          .create( req, res )
          .done();
    } );

router.route( '/:playlist_id' )
    .get( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'GET /playlists/:playlist_id' + req.params.playlist_id );

      new PlaylistRequestController()
          .getByIdParam( req, res )
          .done();
    } )

    .put( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'PUT /playlists/:playlist_id', req.params.playlist_id );

      new PlaylistRequestController()
          .updateByIdParam( req, res )
          .done();
    } )

    .patch( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'PATCH /playlists/:playlist_id', req.params.playlist_id );

      new PlaylistRequestController()
          .updateByIdParam( req, res )
          .done();
    } )

    .delete( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'DELETE /playlists/:playlist_id', req.params.playlist_id );

      new PlaylistRequestController()
          .deleteByIdParam( req, res )
          .done();
    } );

// TODO: DELETE /:playlist_id

router.route( '/:playlist_id/tracks' )
    .post( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'POST /playlists/' + req.params.playlist_id + '/tracks/' );

      new PlaylistRequestController()
          .addTrackByForeignId( req, res )
          .done();
    } );

router.route( '/:playlist_id/tracks/:track_id' );

// TODO: GET /:playlist_id/tracks/:track_id
// TODO: DELETE /:playlist_id/tracks/:track_id

router.route( '/:playlist_id/tracks/:track_id/upvote' )
    .post( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'POST /playlists/' + req.params.playlist_id + '/tracks/' + req.params.track_id + '/upvote' );

      new PlaylistRequestController()
          .upVoteTrack( req, res )
          .done();
    } );

// TODO: DELETE /:playlist_id/tracks/:track_id/upvote

module.exports = router;
