import express from 'express';
import playlistRequestController from './../request/PlaylistRequestController';
import {verify} from '../AuthController';


const router = express.Router();

router.route('/')
  .get(verify,
  (req, res) => {
    console.log('GET /playlists/');

    playlistRequestController
      .getAll(req, res)
      .done();
  })

  .post(verify,
  (req, res) => {
    playlistRequestController
      .create(req, res)
      .done();
  });

router.route('/:playlist_id')
  .get(verify,
  (req, res) => {
    console.log('GET /playlists/:playlist_id' + req.params.playlist_id);

    playlistRequestController
      .getByIdParam(req, res)
      .done();
  })

  .put(verify,
  (req, res) => {
    console.log('PUT /playlists/:playlist_id', req.params.playlist_id);

    playlistRequestController
      .updateByIdParam(req, res)
      .done();
  })

  .patch(verify,
  (req, res) => {
    console.log('PATCH /playlists/:playlist_id', req.params.playlist_id);

    playlistRequestController
      .updateByIdParam(req, res)
      .done();
  })

  .delete(verify,
  (req, res) => {
    console.log('DELETE /playlists/:playlist_id', req.params.playlist_id);

    playlistRequestController
      .deleteByIdParam(req, res)
      .done();
  });

router.route('/:playlist_id/tracks')
  .post(verify,
  (req, res) => {
    console.log('POST /playlists/' + req.params.playlist_id + '/tracks/');

    playlistRequestController
      .addTrackByForeignId(req, res)
      .done();
  });

router.route('/:playlist_id/tracks/:track_id')
  .delete(verify,
    (req, res) => {
      console.log('DELETE /playlists/' + req.params.playlist_id + '/tracks/' + req.params.track_id );

      playlistRequestController
        .deleteTrackFromPlaylist(req, res)
        .done();
    });

export default router;
