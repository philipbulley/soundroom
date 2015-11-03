var express = require('express'),
  router = express.Router(),
  SpotifyService = require('../../service/SpotifyService');

router.route('/:terms')
  .get(function(req, res) {

    console.log('GET /search/:terms', req.params.terms);

    SpotifyService.getInstance().search(req.params.terms)
      .then(function(result) {
        console.log(result);
        if (result.numTracks) {
          console.log(result.getTrack(0));
        }
        res.json(result);
      })
      .catch(function(err) {
        res.send(err);
      });
  });

module.exports = router;
