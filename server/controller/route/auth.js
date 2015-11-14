const express = require('express'),
  passport = require('passport');

const router = express.Router();

// redirect middleware saves Url to redirect to after auth

function setRedirect(req, res, next) {
  req.session.redirect = req.query.redirect;
  next();
}

// http://passportjs.org/docs/authenticate#custom-callback

function customCallback(provider) {
  return (req, res, next) => {
    // passport.authenticate(provider, (err, user, info) => {
    passport.authenticate(provider, (err, user) => {
      if (err) {
        return next(err);
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        const {redirect} = req.session;
        if (redirect) {
          const url = user ? redirect : `${redirect}?error=denied`;
          delete req.session.redirect;
          return res.redirect(url);
        } else {
          return res.json(req.user || {message: 'Access denied'});
        }
      });
    })(req, res, next);
  };
}

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.route('/google')
  .get(setRedirect, passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called.
// router.route('/google/callback')
//   .get(passport.authenticate('google'), authCallback);

router.route('/google/callback')
  .get(customCallback('google'));


// GET /auth/spotify
router.route('/spotify')
  .get(setRedirect, passport.authenticate('spotify'));

router.route('/spotify/callback')
  .get(customCallback('spotify'));


// GET /auth/twitter
router.route('/twitter')
  .get(setRedirect, passport.authenticate('twitter'));

router.route('/twitter/callback')
  .get(customCallback('twitter'));


// GET /auth/facebook
router.route('/facebook')
  .get(setRedirect, passport.authenticate('facebook'));

router.route('/facebook/callback')
  .get(customCallback('facebook'));

// GET /auth/logout
router.route('/logout')
  .get((req, res) => {
    req.logout();
    // res.redirect('/');
    res.json({message: 'The more we know, the less we show.'});
  });

module.exports = router;
