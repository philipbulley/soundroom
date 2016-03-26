import express from 'express';
import passport from 'passport';


const router = express.Router();

// redirect middleware saves Url to redirect to after auth

function setRedirect(req, res, next) {
  req.session.redirect = req.query.redirect;
  next();
}


// http://passportjs.org/docs/authenticate#custom-callback

function customCallback(provider) {
  return (req, res, next) => {
    passport.authenticate(provider, {session: false}, (err, user) => {
      if (err) {
        return next(err);
      }

      const {AUTH_REDIRECT_URL} = process.env;
      if (AUTH_REDIRECT_URL) {
        const url = user
          ? `${AUTH_REDIRECT_URL}?jwt=${user.generateJwt()}`
          : `${AUTH_REDIRECT_URL}?error=denied`;
        return res.redirect(url);
      } else {
        return res.json(req.user || {message: 'Access denied'});
      }
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


// GET /auth/basic
router.route('/basic')
  .get(setRedirect, passport.authenticate('basic'),
    (req, res) => res.json(req.user));


export default router;
