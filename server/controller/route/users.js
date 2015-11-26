// import _ from 'lodash';
import express from 'express';
import log from './../../util/LogUtil';
import UserController from '../UserController';
import { verify } from '../AuthController';


const router = express.Router();

router.route('/')
  .get(verify,
  (req, res) => {
    new UserController().find()
      .then((users) => res.json(users))
      .catch((err) => res.send(err));
  })

  .post(verify,
  (req, res) => {
    log.debug('POST AUTHORIZED!');
    res.json({message: 'The more we know, the less we show.'});
  });

export default router;
