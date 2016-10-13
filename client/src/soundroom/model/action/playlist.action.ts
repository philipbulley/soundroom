export class PlaylistAction {

  static LOAD_ERROR = `PlaylistAction.ERROR_LOADING`;

  static PROGRESS = `PlaylistAction.PROGRESS`;
  static PAUSE = `PlaylistAction.PAUSE`;

  /** This client begins the server request of attempting to add a track */
  static ADD_TRACK = `PlaylistAction.ADD_TRACK`;

  /** This client has successfully added a track to the playlist. This and all clients should expect an NEW_TRACK around the same time */
  static ADD_TRACK_SUCCESS = `PlaylistAction.ADD_TRACK_SUCCESS`;

  /** This client hasn't been able to add a track to the playlist */
  static ADD_TRACK_ERROR = `PlaylistAction.ADD_TRACK_ERROR`;

  /** A track has been added to the playlist by either this client or another. Playlist+Track info in payload. */
  static TRACK_ADDED = `PlaylistAction.TRACK_ADDED`;

  /** `TRACK_UPDATED` is to be used when a track is simply being updated. */
  static TRACK_UPDATED = `PlaylistAction.TRACK_UPDATED`;

  /** This client begins the server request of attempting to delete a track */
  static DELETE_TRACK = `PlaylistAction.DELETE_TRACK`;

  /** This client has successfully deleted a track from the playlist. This and all clients should expect an TRACK_DELETED around the same time */
  static DELETE_TRACK_SUCCESS = `PlaylistAction.DELETE_TRACK_SUCCESS`;

  /** This client hasn't been able to delete a track from the playlist */
  static DELETE_TRACK_ERROR = `PlaylistAction.DELETE_TRACK_ERROR`;

  /** A track has been deleted from the playlist by either this client or another. Playlist+Track info in payload. */
  static TRACK_DELETED = `PlaylistAction.TRACK_DELETED`;

}
