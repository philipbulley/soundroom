import express from 'express';
import trackController from '../TrackController';
import {verify} from '../AuthController';


const router = express.Router();

router.route('/:track_id/artwork')
  .get(verify,
  (req, res) => {
    const {track_id} = req.params;
    trackController.getArtwork(track_id)
      .then((src) => {
        res.send(src);
      })
      .catch((err) => {
        console.log('error can\'t find track artwork');
        // TODO: send back a default image?
        res.send(err);
      });
  });

export default router;
