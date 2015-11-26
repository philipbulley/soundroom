import express from 'express';
import log from './../../util/LogUtil';
import { verify } from '../AuthController';


const router = express.Router();

router.route('/')
  .get(verify, (req, res) => {
    log.debug('GET AUTHORIZED!');
    if (req.user) {
      res.json(req.user);
    } else {
      res.json({message: 'The more we know, the less we show.'});
    }
  })
  .post(verify, (req, res) => {
    log.debug('POST AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  });

export default router;
