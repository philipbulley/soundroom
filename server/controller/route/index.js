import express from 'express';
import log from './../../util/LogUtil';
import { verify } from '../AuthController';

const router = express.Router();

router.route('/')
  .get(verify, (req, res) => {
    res.json(req.user);
    // log.debug('GET AUTHORIZED!');
    // res.json({message: 'The more we know, the less we show.'});
  })
  .post(verify, (req, res) => {
    log.debug('POST AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  });

module.exports = router;
