export class PlaylistAction {

  static PAUSE = `PlaylistAction.PAUSE`;

  /** A track has been added to the playlist by either this client or another. Playlist+Track info in payload. */
  static TRACK_ADDED = `PlaylistAction.TRACK_ADDED`;

  /** `TRACK_UPDATED` is to be used when a track is simply being updated. */
  static TRACK_UPDATED = `PlaylistAction.TRACK_UPDATED`;

  /** This client begins the server request of attempting to delete a track */
  static DELETE_TRACK = `PlaylistAction.DELETE_TRACK`;

  /** A track has been deleted from the playlist by either this client or another. Playlist+Track info in payload. */
  static TRACK_DELETED = `PlaylistAction.TRACK_DELETED`;

}
