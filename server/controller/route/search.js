var express = require('express'),
  SpotifyService = require('../../service/SpotifyService'),
  auth = require('../AuthController');

const router = express.Router();

router.route('/')
  .get(auth.verify, (req, res) => {
    res.json([]);
  });

router.route('/:terms')
  .get(auth.verify, (req, res) => {

    console.log('GET /search/:terms', req.params.terms);

    SpotifyService.getInstance().search(req.params.terms)
      .then((result) => {
        const tracks = [];
        if (result.numTracks) {
          const length = Math.min(result.numTracks, 10);
          while (tracks.length < length) {
            tracks.push(result.getTrack(tracks.length));
          }
        }
        res.json(tracks);
      })
      .catch((err) => {
        res.send(err);
      });
  });

module.exports = router;
