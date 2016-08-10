export class SocketEventTypeEnum {

  static CONNECTION = 'connection';
  static CONNECT = 'connect';
  static AUTHENTICATE = 'authenticate';
  static AUTHENTICATED = 'authenticated';
  static PLAYLIST_PLAY = 'playlist.play';
  static PLAYLIST_PAUSE = 'playlist.pause';
  static PLAYLIST_TRACK_UPVOTE = 'playlist.track.upvote';
  static PLAYLIST_TRACK_VETO = 'playlist.track.veto';
  static PLAYLIST_TRACKS_CHANGE = 'playlist.tracks.change';
  static DISCONNECT = 'disconnect';
  static PLAYLIST_TRACK_START = 'playlist.track.start';
  static PLAYLIST_TRACK_PROGRESS = 'playlist.track.progress';
  static PLAYLIST_END = 'playlist.end';
  static USER_UPDATE = 'user.update';
  static ERROR_PLAYLIST_TRACK_UPVOTE = 'error.playlist.track.upvote';
  static ERROR_PLAYLIST_TRACK_VETO = 'error.playlist.track.veto';

}
