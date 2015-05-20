var express        = require( 'express' ),
    router         = express.Router(),
    UserController = require( '../UserController' ),
    //AuthController = require( './../AuthController' ),
    //PermissionEnum = require( './../../model/enum/PermissionEnum' ),
    log            = require( './../../util/LogUtil' );

router.route( '/' )
    .get( /*AuthController.verify( PermissionEnum.NDA ),*/
    function( req, res )
    {
      log.debug( 'GET AUTHORIZED!' );
      res.json( { message: 'The more we know, the less we show.' } );
    } )

    .post( /*AuthController.verify(),*/
    function( req, res )
    {
      log.debug( 'POST AUTHORIZED!' );
      res.json( { message: 'The more we know, the less we show.' } );
    } );

module.exports = router;
