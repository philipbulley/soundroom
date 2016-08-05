export class PlaylistAction {

  static LOADING = `PlaylistAction.LOAD`;
  static ERROR_LOADING = `PlaylistAction.ERROR_LOADING`;

  static PROGRESS = `PlaylistAction.PROGRESS`;
  static PAUSE = `PlaylistAction.PAUSE`;

  /** This client begins the server request of attempting to add a track */
  static ADDING_TRACK = `PlaylistAction.ADDING_TRACK`;

  /** This client has successfully added a track to the playlist. This and all clients should expect an ADD_TRACK around the same time */
  static ADDING_TRACK_SUCCESS = `PlaylistAction.ADDING_TRACK_SUCCESS`;

  /** This client hasn't been able to add a track to the playlist */
  static ADDING_TRACK_ERROR = `PlaylistAction.ADDING_TRACK_ERROR`;

  /** A track has been added to the playlist by either this client or another. Playlist+Track info in payload. */
  static ADD_TRACK = `PlaylistAction.ADD_TRACK`;

  /** `UPDATE_TRACK` is to be used when a track is simply being updated. */
  static UPDATE_TRACK = `PlaylistAction.UPDATE_TRACK`;

  /** This client begins the server request of attempting to delete a track */
  static DELETING_TRACK = `PlaylistAction.DELETING_TRACK`;

  /** This client has successfully deleted a track from the playlist. This and all clients should expect an DELETE_TRACK around the same time */
  static DELETING_TRACK_SUCCESS = `PlaylistAction.DELETING_TRACK_SUCCESS`;

  /** This client hasn't been able to delete a track from the playlist */
  static DELETING_TRACK_ERROR = `PlaylistAction.DELETING_TRACK_ERROR`;

  /** A track has been deleted from the playlist by either this client or another. Playlist+Track info in payload. */
  static DELETE_TRACK = `PlaylistAction.DELETE_TRACK`;

}
