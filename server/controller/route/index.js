var express = require('express'),
  log = require('./../../util/LogUtil'),
  auth = require('../AuthController');

const router = express.Router();

router.route('/')
  .get(auth.verify, (req, res) => {
    res.json(req.user);
    // log.debug('GET AUTHORIZED!');
    // res.json({message: 'The more we know, the less we show.'});
  })

  .post(auth.verify, (req, res) => {
    log.debug('POST AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  });

module.exports = router;
