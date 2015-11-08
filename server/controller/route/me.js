var express = require('express'),
  router = express.Router(),
  UserController = require('../UserController'),
  log = require('./../../util/LogUtil'),
  auth = require('../AuthController');

router.route('/')
  .get(auth.verify,
  function (req, res) {
    log.debug('GET AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  })

  .post(auth.verify,
  function (req, res) {
    log.debug('POST AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  });

module.exports = router;
