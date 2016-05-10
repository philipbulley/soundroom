const EventTypeEnum = {
  CONNECTION: 'connection',
  CONNECT: 'connect',
  USER_ENTER: 'user.enter',
  PLAYLIST_PLAY: 'playlist.play',
  PLAYLIST_PAUSE: 'playlist.pause',
  PLAYLIST_TRACK_UPVOTE: 'playlist.track.upvote',
  PLAYLIST_TRACK_VETO: 'playlist.track.veto',
  PLAYLIST_TRACKS_CHANGE: 'playlist.tracks.change',
  DISCONNECT: 'disconnect',
  PLAYLIST_TRACK_START: 'playlist.track.start',
  PLAYLIST_TRACK_PROGRESS: 'playlist.track.progress',
  PLAYLIST_END: 'playlist.end',
  USER_UPDATE: 'user.update',

  ERROR_PLAYLIST_TRACK_UPVOTE: 'error.playlist.track.upvote',
  ERROR_PLAYLIST_TRACK_VETO: 'error.playlist.track.veto'
};

export default EventTypeEnum;
