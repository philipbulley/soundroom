import playlistController from './PlaylistController';
import spotifyService from './../service/SpotifyService';
import socketService from './../service/SocketService';
import playbackState from '../model/state/PlaybackState';


const pause = () => {
  spotifyService.pause();
  socketService.emitPause({
    playlistId: playbackState.currentPlaylistId,
    playlistTrackId: playbackState.currentPlaylistTrack
      ? playbackState.currentPlaylistTrack._id
      : null,
    trackId: playbackState.currentPlaylistTrack
      ? playbackState.currentPlaylistTrack.track._id
      : null
  });
};

/**
 * Call when we already have a `playbackState.currentPlaylistTrack` and we want to resume playback of that track.
 * Usually this should be called via `play()`.
 */
const resume = () => {
  if (!playbackState.currentPlaylistTrack) {
    throw new Error('Can\'t resume as we dont have a playbackState.currentPlaylistTrack');
  }

  spotifyService.resume();
  socketService.emitPlay({
    playlistId: playbackState.currentPlaylistId,
    playlistTrackId: playbackState.currentPlaylistTrack._id,
    trackId: playbackState.currentPlaylistTrack.track._id
  });
};

/**
 * To be called when wanting to start playback of a specific playlist.
 *
 * @param {string} playlistId
 * @param {playlistTrack} previousTrack
 * @returns {Promise<playlistTrack>}
 */
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

      if (!previousTrack) {
        // This is not an automatic continuation of the playlist, so notify that playlist is now playing
        socketService.emitPlay({
          playlistId: playlistId,
          playlistTrackId: playlistTrack._id,
          trackId: playlistTrack.track._id
        });
      }

      // Notify that a new track is beginning
      socketService.emitTrackStart({
        playlistId: playlistId,
        playlistTrackId: playlistTrack._id,
        trackId: playlistTrack.track._id
      });

      spotifyService.on('progress', (progressData) => {
        socketService.emitTrackProgress({
          playlistId: playlistId,
          playlistTrackId: playlistTrack._id,
          trackId: playlistTrack.track._id,
          currentTime: progressData.currentTime,
          duration: progressData.duration,
          progress: progressData.progress
        });
      });

      spotifyService.on('end', () => {
        const {currentPlaylistTrack} = playbackState;
        playbackState.currentPlaylistTrack = null;

        // Auto-continue by asking the next track in the playlist to start playbakc
        play(playlistId, currentPlaylistTrack);
      });

      spotifyService.play(playlistTrack.track.foreignId);

      return playlistTrack;
    });
};

export {play, pause};
