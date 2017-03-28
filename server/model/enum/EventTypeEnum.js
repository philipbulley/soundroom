const EventTypeEnum = {
  CONNECTION: 'connection',
  CONNECT: 'connect',
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  PLAYLIST_PLAY: 'playlist.play',
  PLAYLIST_PAUSE: 'playlist.pause',
  PLAYLIST_TRACK_UP_VOTE: 'playlist.track.up-vote',
  PLAYLIST_TRACK_VETO: 'playlist.track.veto',
  PLAYLIST_TRACKS_CHANGE: 'playlist.tracks.change',
  DISCONNECT: 'disconnect',
  PLAYLIST_TRACK_START: 'playlist.track.start',
  PLAYLIST_TRACK_PROGRESS: 'playlist.track.progress',
  PLAYLIST_END: 'playlist.end',
  USER_UPDATE: 'user.update',

  ERROR_PLAYLIST_TRACK_UP_VOTE: 'error.playlist.track.up-vote',
  ERROR_PLAYLIST_TRACK_VETO: 'error.playlist.track.veto'
};

export default EventTypeEnum;
