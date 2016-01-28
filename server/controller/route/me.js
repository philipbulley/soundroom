// import _ from 'lodash';
import express from 'express';
// import UserController from '../UserController';
import { verify } from '../AuthController';
import log from './../../util/LogUtil';


const router = express.Router();

router.route('/')
  .get(verify,
  (req, res) => {
    log.debug('GET AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  })

  .post(verify,
  (req, res) => {
    log.debug('POST AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  });

export default router;
