var _            = require( 'lodash' ),
    Q            = require( 'q' ),
    signals      = require( 'signals' ),
    mongoose     = require( 'mongoose' ),
    log          = require( './../util/LogUtil' ),
    FunctionUtil = require( './../util/FunctionUtil' );

function MongooseService()
{
  FunctionUtil.bindAllMethods( this );
}

_.extend( MongooseService, {

  db: {
    appInstance: null
  },

  onAppInstanceOpen: new signals.Signal(),

  connectToAppInstance: function( connectionUri )
  {
    log.debug( 'MongooseService.connectToAppInstance', connectionUri );
    if( !connectionUri )
      throw new Error( 'Please specify a connectionUri before attempting to connect to the appInstance DB' );

    var deferred = Q.defer();

    //mongoose.connect();
    this.db.appInstance = mongoose.createConnection( connectionUri );
    this.db.appInstance.on( 'error', function()
    {
      deferred.reject( 'MongooseService: db.appInstance connection error' );
    } );
    this.db.appInstance.once( 'open', function()
    {
      MongooseService.onAppInstanceOpen.dispatch();

      log.info( 'Connected to AppInstance DB: ', connectionUri.split( '@' )[ 1 ] );    // Not logging DB credentials

      deferred.resolve( this.db.appInstance );
    } );

    return deferred.promise;
  }


} );

MongooseService.prototype = {};

module.exports = MongooseService;
