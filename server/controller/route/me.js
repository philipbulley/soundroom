// import _ from 'lodash';
import express from 'express';
// import UserController from '../UserController';
import { verify } from '../AuthController';
import log from './../../util/LogUtil';


const router = express.Router();

router.route('/')
  .get(verify,
  (req, res) => {

    if(req.query && req.query.action){
      switch(req.query.action){
        case 'logout':
          req.logout();
          res.json({});
          return;
      }
    } else {
      res.json(req.user);
    }

  })

  .post(verify,
  (req, res) => {
    log.debug('POST AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  });

export default router;
