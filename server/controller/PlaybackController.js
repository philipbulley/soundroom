import { EventEmitter } from 'events';
import FunctionUtil from './../util/FunctionUtil';
import PlaylistController from './PlaylistController';
import spotifyService from './../service/SpotifyService';

class PlaybackController extends EventEmitter {

  constructor () {
    super();

    FunctionUtil.bindAllMethods(this);

    this.playlistController = new PlaylistController();
  }

  play (playlistId) {
    return this.playlistController.getNextTrackForPlayback(playlistId)
      .then((playlistTrack) => {
        console.log(`PlaybackController.play: Next track: ${playlistTrack}`);

        spotifyService.removeAllListeners('progress');
        spotifyService.removeAllListeners('end');

        if (!playlistTrack) {
          console.log('playlist ended');
          this.emit('end');
          return null;
        }

        spotifyService.on('progress', (progress) => console.log('progress:', progress));
        spotifyService.on('end', () => console.log('track ended'));
        spotifyService.on('end', () => this.play(playlistId));
        spotifyService.play(playlistTrack.track.foreignId);

        this.emit('track', playlistTrack);

        return playlistTrack;
      });
  }

}

export default PlaybackController;
