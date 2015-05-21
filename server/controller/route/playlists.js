var express            = require( 'express' ),
    router             = express.Router(),
    PlaylistController = require( '../PlaylistController' ),
    //AuthController = require( './../AuthController' ),
    //PermissionEnum = require( './../../model/enum/PermissionEnum' ),
    log                = require( './../../util/LogUtil' );

router.route( '/' )
    .get( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'GET /playlists/' );

      new PlaylistController()
          .getAll( req, res )
          .done();
    } )

    .post( /*AuthController.verify(),*/
    function( req, res )
    {
      new PlaylistController()
          .create( req, res )
          .done();
    } );

router.route( '/:playlist_id' )
    .get( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'GET /playlists/' + req.params.playlist_id );

      new PlaylistController()
          .getByIdParam( req, res )
          .done();
    } );


router.route( '/:playlist_id/track' )
    .post( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'POST /playlists/' + req.params.playlist_id + '/track/' );

      new PlaylistController()
          .addTrack( req, res )
          .done();
    } );

// TODO: Create upvote route
router.route( '/:playlist_id/track/:track_id/upvote' )
    .post( /*AuthController.verify(),*/
    function( req, res )
    {
      console.log( 'POST /playlists/' + req.params.playlist_id + '/track/' + req.params.track_id + '/upvote');

      new PlaylistController()
          .upVoteTrack( req, res )
          .done();
    } );

module.exports = router;
