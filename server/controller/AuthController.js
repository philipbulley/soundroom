const passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  SpotifyStrategy = require('passport-spotify').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;

function enableGoogleLogin(userController) {
  // API Access link for creating client ID and secret:
  // https://code.google.com/apis/console/
  const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

  const hasCredentials = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET;
  if (!hasCredentials) {
    return;
  }
  // Use the GoogleStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Google
  //   profile), and invoke a callback with a user object.
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    // console.log(`accessToken:${accessToken}`);
    userController.findOrCreate({
    // userController.create({
      googleId: profile.id,
      name: profile.displayName,
      avatar: profile.photos[0].value
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
    // asynchronous verification, for effect...
    // process.nextTick(() => {
    //
    //   // To keep the example simple, the user's Google profile is returned to
    //   // represent the logged-in user.  In a typical application, you would want
    //   // to associate the Google account with a user record in your database,
    //   // and return that user instead.
    //   return done(null, profile);
    // });
  }));
}

function enableSpotifyLogin(userController) {

  const {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} = process.env;

  const hasCredentials = SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET;
  if (!hasCredentials) {
    return;
  }

  passport.use(new SpotifyStrategy({
    clientID: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/spotify/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    userController.findOrCreate({
      spotifyId: profile.id,
      name: profile.displayName || profile.username,
      avatar: profile.photos.length ? profile.photos[0].value : null
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
  }));
}

function enableFacebookLogin(userController) {

  const {FACEBOOK_APP_ID, FACEBOOK_APP_SECRET} = process.env;

  const hasCredentials = FACEBOOK_APP_ID && FACEBOOK_APP_SECRET;
  if (!hasCredentials) {
    return;
  }

  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/facebook/callback`,
    enableProof: false,
    profileFields: ['id', 'displayName', 'picture']
  },
  (accessToken, refreshToken, profile, done) => {
    userController.findOrCreate({
      facebookId: profile.id,
      name: profile.displayName,
      avatar: profile.photos[0].value
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
  }));
}

function enableTwitterLogin(userController) {

  const {TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET} = process.env;

  const hasCredentials = TWITTER_CONSUMER_KEY && TWITTER_CONSUMER_SECRET;
  if (!hasCredentials) {
    return;
  }

  passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/twitter/callback`
  },
  (token, tokenSecret, profile, done) => {
    userController.findOrCreate({
      twitterId: profile.id,
      name: profile.displayName,
      avatar: profile.photos[0].value
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
  }));
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function verify(req, res, next) {
  // do not authenticate for unit tests
  if (process.env.NO_AUTH) {
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).end('Unauthorized');
}

function init(app) {

  const UserController = require('./UserController');
  const userController = new UserController();

  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the complete Google profile is
  //   serialized and deserialized.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userController.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // enable login providers

  enableGoogleLogin(userController);
  enableSpotifyLogin(userController);
  enableTwitterLogin(userController);
  enableFacebookLogin(userController);

  // init passport

  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = {
  init,
  verify
};
