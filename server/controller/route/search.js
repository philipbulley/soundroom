import express from 'express';
import searchController from '../SearchController';
import {verify} from '../AuthController';


const router = express.Router();

router.route('/')
  .get(verify, (req, res) => {
    res.json([]);
  });

router.route('/:terms')
  .get(verify, (req, res) => {

    console.log('GET /search/:terms', req.params.terms);

    searchController.search(req.params.terms)
      .then((results) => res.json(results))
      .catch((err) => res.send(err));
  });

export default router;
