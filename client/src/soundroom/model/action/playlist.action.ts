export class PlaylistAction {

  static TRACK_ADDED = `PlaylistAction.TRACK_ADDED`;

  static TRACK_UPDATED = `PlaylistAction.TRACK_UPDATED`;

  /** A track has been deleted from the playlist by either this client or another. Playlist+Track info in payload. */
  static TRACK_DELETED = `PlaylistAction.TRACK_DELETED`;

}
