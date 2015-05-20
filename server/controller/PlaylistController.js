var _            = require( 'lodash' ),
    Q            = require( 'q' ),
    FunctionUtil = require( './../util/FunctionUtil' ),
    log          = require( './../util/LogUtil' ),
    Playlist     = require( './../model/db/Playlist' ),
    //PermissionErrorEnum = require( './../model/enum/PermissionErrorEnum' ),
    Config       = require( './../model/Config' );

function PlaylistController()
{
  FunctionUtil.bindAllMethods( this );
}

_.extend( PlaylistController, {} );

PlaylistController.prototype = {};

module.exports = PlaylistController;
