import PlaylistController from './PlaylistController';
import spotifyService from './../service/SpotifyService';
import socketService from './../service/SocketService';

const playlistController = new PlaylistController();
let isTrackPlaying = false;


const pause = () => {
  spotifyService.pause();
  socketService.emitPause();
};

const resume = () => {
  spotifyService.resume();
  socketService.emitPlay();
};

const play = (playlistId) => {
  if (isTrackPlaying) {
    return resume();
  }

  return playlistController.getNextTrackForPlayback(playlistId)
    .then((track) => {
      console.log(`PlaybackController.play: Next track: ${track}`);

      spotifyService.removeAllListeners('progress');
      spotifyService.removeAllListeners('end');

      if (!track) {
        isTrackPlaying = false;
        return socketService.emitPlaylistEnd(playlistId);
      }

      socketService.emitTrackStart(track);

      spotifyService.on('progress', (progressData) => {
        socketService.emitTrackProgress(track, progressData);
      });

      spotifyService.on('end', () => {
        isTrackPlaying = false;
        play(playlistId);
      });

      spotifyService.play(track.track.foreignId);

      isTrackPlaying = true;

      return track;
    });
};

export {play, pause};
