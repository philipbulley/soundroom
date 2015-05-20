var SpotifyService  = require( './service/SpotifyService' ),
    express         = require( 'express' ),
    app             = express(),
    bodyParser      = require( 'body-parser' ),
    cors            = require( 'cors' ),
    log             = require( './util/LogUtil' ),
    MongooseService = require( './service/MongooseService' );


log.level = log.LEVEL_DEBUG;
log.info( '__________________________________________________' );
log.info( 'Hello! Starting Spotidrop initialization. Please wait...' );

// Promise chain ensures DB is set up first, then app
MongooseService.connectToAppInstance( 'mongodb://pacino:jdur7sajcmskd8310dk@ds031922.mongolab.com:31922/spotidrop-dev' )
  // DB Setup complete. Safe to execute anything that creates Mongoose Models
    .then( function()
    {
      //AuthController = require( './controller/AuthController' );
    } )
    .then( function()
    {
      app.use( bodyParser.urlencoded( { extended: true } ) );
      app.use( bodyParser.json() );

      //AuthController.init( app );

      // Routes
      var routes = {
        index: require( './controller/route/index' ),
        playlists: require( './controller/route/playlists' ),
        users: require( './controller/route/users' ),
        me: require( './controller/route/me' )
      };

      app.use( cors() );
      //app.use( '/media', express.static( __dirname + '/media' ) );

      app.use( '/api', routes.index )
          .use( '/api/playlists', routes.playlists )
          .use( '/api/users', routes.users )
          .use( '/api/me', routes.me );

      // Start the server!
      app.listen( process.env.PORT );
      log.info( 'Initialization complete! Hit me up on localhost:' + process.env.PORT + '!' );
    } )
    .catch( function( err )
    {
      log.error( 'FATAL app initialization error:\n', err, '\n', err.stack, '\nCan\'t recover! Ouch. Ugh. Dead.' );
      process.exit( 1 );    // Fatal. Exit!
    } )
    .done();
