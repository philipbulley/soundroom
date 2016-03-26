// import _ from 'lodash';
import express from 'express';
import {verify} from '../AuthController';
import log from './../../util/LogUtil';


const router = express.Router();

router.route('/')
  .get(verify,
    // .get(passport.authenticate('jwt', {session:false}),
    (req, res) => {

      res.json(req.user);

    })

  .post(verify,
    (req, res) => {
      log.debug('POST AUTHORIZED!');
      res.json({message: 'The more we know, the less we show.'});
    });

export default router;
