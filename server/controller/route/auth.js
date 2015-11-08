const express = require('express'),
  passport = require('passport');

const router = express.Router();

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.route('/google')
  .get(passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  }), (req, res) => {
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.route('/google/callback')
  .get(passport.authenticate('google'), (req, res) => {
    res.json({message: 'Log in successful'});
  });

router.route('/logout')
  .get((req, res) => {
    req.logout();
    // res.redirect('/');
    res.json({message: 'The more we know, the less we show.'});
  });

module.exports = router;
