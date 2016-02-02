import express from 'express';
import PlaylistRequestController from './../request/PlaylistRequestController';
import { verify } from '../AuthController';


const router = express.Router();

router.route('/')
  .get(verify,
  (req, res) => {
    console.log('GET /playlists/');

    new PlaylistRequestController()
      .getAll(req, res)
      .done();
  })

  .post(verify,
  (req, res) => {
    new PlaylistRequestController()
      .create(req, res)
      .done();
  });

router.route('/:playlist_id')
  .get(verify,
  (req, res) => {
    console.log('GET /playlists/:playlist_id' + req.params.playlist_id);

    new PlaylistRequestController()
      .getByIdParam(req, res)
      .done();
  })

  .put(verify,
  (req, res) => {
    console.log('PUT /playlists/:playlist_id', req.params.playlist_id);

    new PlaylistRequestController()
      .updateByIdParam(req, res)
      .done();
  })

  .patch(verify,
  (req, res) => {
    console.log('PATCH /playlists/:playlist_id', req.params.playlist_id);

    new PlaylistRequestController()
      .updateByIdParam(req, res)
      .done();
  })

  .delete(verify,
  (req, res) => {
    console.log('DELETE /playlists/:playlist_id', req.params.playlist_id);

    new PlaylistRequestController()
      .deleteByIdParam(req, res)
      .done();
  });

// TODO: DEPRECATE PLAY REST ENDPOINT, TO BE INVOKED VIA WEB SOCKET
router.route('/:playlist_id/play')
  .post(verify,
  (req, res) => {
    console.log('POST /playlists/' + req.params.playlist_id + '/play');

    new PlaylistRequestController()
      .play(req, res)
      .done();
  });

router.route('/:playlist_id/tracks')
  .post(verify,
  (req, res) => {
    console.log('POST /playlists/' + req.params.playlist_id + '/tracks/');

    new PlaylistRequestController()
      .addTrackByForeignId(req, res)
      .done();
  });

// router.route('/:playlist_id/tracks/:track_id')
  // .get(verify, (req, res) => )

// TODO: GET /:playlist_id/tracks/:track_id
// TODO: DELETE /:playlist_id/tracks/:track_id

router.route('/:playlist_id/tracks/:track_id/upvote')
  .post(verify,
  (req, res) => {
    console.log('POST /playlists/' + req.params.playlist_id + '/tracks/' + req.params.track_id + '/upvote');

    new PlaylistRequestController()
      .upVoteTrack(req, res)
      .done();
  });

// TODO: DELETE /:playlist_id/tracks/:track_id/upvote

export default router;
