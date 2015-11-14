var express = require('express'),
  SpotifyService = require('../../service/SpotifyService'),
  auth = require('../AuthController'),
  _ = require('lodash');

const router = express.Router();

router.route('/')
  .get(auth.verify, (req, res) => {
    res.json([]);
  });

router.route('/:terms')
  .get(auth.verify, (req, res) => {

    console.log('GET /search/:terms', req.params.terms);

    SpotifyService.getInstance().search(req.params.terms)
      .then((result) => {
        if (!result.numTracks) {
          return res.json([]);
        }
        const tracks = [];
        for (let i = 0; i < result.numTracks; i++) {
          const track = result.getTrack(i);

          const link = track.link;
          const title = track.name;
          const album = track.album.link;
          // const image = SpotifyService.getInstance().getImage(album)
          //   .then((img) => {
          //     console.log('image:', img.length);
          //   });
          const artist = track.artists.reduce((val, nth) => {
            return val ? `${val}, ${nth.name}` : nth.name;
          }, '');

          tracks.push({
            artist,
            title,
            link,
            album
          });
        }
        res.json(_.uniq(tracks, (n) => n.artist + n.title));
      })
      .catch((err) => {
        res.send(err);
      });
  });

module.exports = router;
