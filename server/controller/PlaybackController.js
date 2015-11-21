import FunctionUtil from './../util/FunctionUtil';
import PlaylistController from './PlaylistController';
import spotifyService from './../service/SpotifyService';
import socketService from './../service/SocketService';

class PlaybackController {

  constructor () {
    FunctionUtil.bindAllMethods(this);

    this.playlistController = new PlaylistController();

    socketService.on('pause', this.pause);
    socketService.on('resume', this.resume);

  }

  play (playlistId) {
    return this.playlistController.getNextTrackForPlayback(playlistId)
      .then((playlistTrack) => {
        console.log(`PlaybackController.play: Next track: ${playlistTrack}`);

        spotifyService.removeAllListeners('progress');
        spotifyService.removeAllListeners('end');

        if (!playlistTrack) {
          console.log('playlist ended');
          socketService.emitPlaylistEnd();
          return null;
        }

        socketService.emitTrackStart(playlistTrack);

        spotifyService.on('progress', (progressData) => {
          // const { currentTime, duration, progress } = progressData;
          // console.log('progress:', `${currentTime}/${duration} ${progress}`);
          socketService.emitTrackProgress(progressData);
        });

        spotifyService.on('end', () => {
          console.log('track ended');
          this.play(playlistId);
        });

        spotifyService.play(playlistTrack.track.foreignId);

        return playlistTrack;
      });
  }

  pause () {
    spotifyService.pause();
    socketService.emitPause();
  }

  resume () {
    spotifyService.resume();
    socketService.emitResume();
  }

}

export default PlaybackController;
