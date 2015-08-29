var _ = require('lodash'),
  Q = require('q'),
  FunctionUtil = require('./../util/FunctionUtil'),
  log = require('./../util/LogUtil'),
  PlaylistController = require('./PlaylistController'),
  SpotifyService = require('./../service/SpotifyService'),
  Config = require('./../model/Config');

function PlaybackController() {
  FunctionUtil.bindAllMethods(this);

  this.playlistController = new PlaylistController();
  this.spotifyService = SpotifyService.getInstance();
}

_.extend(PlaybackController, {});

PlaybackController.prototype = {
  playlistController: null,
  spotifyService: null,

  play: function (playlistId) {
    return this.playlistController.getNextTrackForPlayback(playlistId)
      .then(function (playlistTrack) {
        console.log('PlaybackController.play: Next track:', playlistTrack);

        this.spotifyService.play(playlistTrack.track.foreignId);

        return playlistTrack;
      }.bind(this));
  }

};

module.exports = PlaybackController;
