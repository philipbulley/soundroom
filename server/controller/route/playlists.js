var express = require('express'),
  router = express.Router(),
  PlaylistRequestController = require('./../request/PlaylistRequestController'),
  log = require('./../../util/LogUtil'),
  auth = require('../AuthController');

router.route('/')
  .get(auth.verify,
  function (req, res) {
    console.log('GET /playlists/');

    new PlaylistRequestController()
      .getAll(req, res)
      .done();
  })

  .post(auth.verify,
  function (req, res) {
    new PlaylistRequestController()
      .create(req, res)
      .done();
  });

router.route('/:playlist_id')
  .get(auth.verify,
  function (req, res) {
    console.log('GET /playlists/:playlist_id' + req.params.playlist_id);

    new PlaylistRequestController()
      .getByIdParam(req, res)
      .done();
  })

  .put(auth.verify,
  function (req, res) {
    console.log('PUT /playlists/:playlist_id', req.params.playlist_id);

    new PlaylistRequestController()
      .updateByIdParam(req, res)
      .done();
  })

  .patch(auth.verify,
  function (req, res) {
    console.log('PATCH /playlists/:playlist_id', req.params.playlist_id);

    new PlaylistRequestController()
      .updateByIdParam(req, res)
      .done();
  })

  .delete(auth.verify,
  function (req, res) {
    console.log('DELETE /playlists/:playlist_id', req.params.playlist_id);

    new PlaylistRequestController()
      .deleteByIdParam(req, res)
      .done();
  });

// TODO: Add integration test for this endpoint
router.route('/:playlist_id/play')
  .post(auth.verify,
  function (req, res) {
    console.log('POST /playlists/' + req.params.playlist_id + '/play');

    new PlaylistRequestController()
      .play(req, res)
      .done();
  });

router.route('/:playlist_id/tracks')
  .post(auth.verify,
  function (req, res) {
    console.log('POST /playlists/' + req.params.playlist_id + '/tracks/');

    new PlaylistRequestController()
      .addTrackByForeignId(req, res)
      .done();
  });

router.route('/:playlist_id/tracks/:track_id');

// TODO: GET /:playlist_id/tracks/:track_id
// TODO: DELETE /:playlist_id/tracks/:track_id

router.route('/:playlist_id/tracks/:track_id/upvote')
  .post(auth.verify,
  function (req, res) {
    console.log('POST /playlists/' + req.params.playlist_id + '/tracks/' + req.params.track_id + '/upvote');

    new PlaylistRequestController()
      .upVoteTrack(req, res)
      .done();
  });

// TODO: DELETE /:playlist_id/tracks/:track_id/upvote


module.exports = router;
