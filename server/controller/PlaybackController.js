import playlistController from './PlaylistController';
import spotifyService from './../service/SpotifyService';
import socketService from './../service/SocketService';
import playbackState from '../model/state/PlaybackState';


const pause = () => {
  spotifyService.pause();
  socketService.emitPause();
};

const resume = () => {
  spotifyService.resume();
  socketService.emitPlay();
};

const play = (playlistId, previousTrack = null) => {
  console.log('playbackState Track Playing', !!playbackState.currentPlaylistTrack);
  if (playbackState.currentPlaylistTrack) {
    return resume();
  }

  return playlistController.getNextTrackForPlayback(playlistId, previousTrack)
    .then((playlistTrack) => {
      // console.log(`PlaybackController.play: Next track: ${playlistTrack}`);

      spotifyService.removeAllListeners('progress');
      spotifyService.removeAllListeners('end');

      playbackState.currentPlaylistId = playlistId;
      playbackState.currentPlaylistTrack = playlistTrack;

      if (!playlistTrack) {
        return socketService.emitPlaylistEnd(playlistId);
      }

      socketService.emitTrackStart(playlistTrack);

      spotifyService.on('progress', (progressData) => {
        socketService.emitTrackProgress({
          playlistId: playlistId,
          trackId: playlistTrack.track._id,
          currentTime: progressData.currentTime,
          duration: progressData.duration,
          progress: progressData.progress
        });
      });

      spotifyService.on('end', () => {
        const {currentPlaylistTrack} = playbackState;
        playbackState.currentPlaylistTrack = null;
        play(playlistId, currentPlaylistTrack);
      });

      spotifyService.play(playlistTrack.track.foreignId);

      return playlistTrack;
    });
};

export {play, pause};
