import passport from 'passport';
import { find, findOrCreate, findById } from './UserController';
import { BasicStrategy } from 'passport-http';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';


function enableGoogleLogin() {
  // API Access link for creating client ID and secret:
  // https://code.google.com/apis/console/
  const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env;

  const hasCredentials = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET;
  if (!hasCredentials) {
    return;
  }

  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    findOrCreate({
      googleId: profile.id,
      name: profile.displayName,
      avatar: profile.photos[0].value
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
  }));
}

function enableSpotifyLogin() {

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
    findOrCreate({
      spotifyId: profile.id,
      name: profile.displayName || profile.username,
      avatar: profile.photos.length ? profile.photos[0].value : null
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
  }));
}

function enableFacebookLogin() {

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
    findOrCreate({
      facebookId: profile.id,
      name: profile.displayName,
      avatar: profile.photos[0].value
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
  }));
}

function enableTwitterLogin() {

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
    findOrCreate({
      twitterId: profile.id,
      name: profile.displayName,
      avatar: profile.photos[0].value
    })
    .then((user) => done(null, user))
    .catch((err) => done(err));
  }));
}

function enableBasicAuthLogin() {

  const {AUTH_USER, AUTH_PASS} = process.env;

  const hasCredentials = AUTH_USER && AUTH_PASS;
  if (!hasCredentials) {
    return;
  }

  passport.use(new BasicStrategy(
  (username, password, done) => {
    if (username === AUTH_USER && password === AUTH_PASS) {
      findOrCreate({
        userId: username,
        name: 'BasicAuth User',
        avatar: null
      })
      .then((user) => done(null, user))
      .catch((err) => done(err));
    } else {
      return done(null, false);
    }
  }));
}

function enableJwt() {
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = process.env.JWT_TOKEN_SECRET;
  // opts.issuer = "accounts.examplesoft.com";
  // opts.audience = "yoursite.net";
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    // jwtPayload.iss: we've previously set the user id as `iss` when creating the JWT
    console.log('AuthController.enableJwt: jwtPayload:', jwtPayload);
    findById(jwtPayload.iss)
      .then((user) => done(null, user))
      .catch((err) => done(err));
  }));
}

// Simple route middleware to ensure user is authenticated.

function verify(req, res, next) {
  // do not authenticate for unit tests
  if (process.env.NO_AUTH) {
    return next();
  }

  return passport.authenticate('jwt', {session:false})(req, res, next);
}

function initAuth(app) {
  // enable login providers
  enableGoogleLogin();
  enableSpotifyLogin();
  enableTwitterLogin();
  enableFacebookLogin();
  enableBasicAuthLogin();
  enableJwt();

  // init passport
  app.use(passport.initialize());

  return app;
}

export { initAuth, verify };
