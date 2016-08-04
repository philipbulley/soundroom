export class PlaylistAction {

  static LOADING = `PlaylistAction.LOAD`;
  static ERROR_LOADING = `PlaylistAction.ERROR_LOADING`;

  static PROGRESS = `PlaylistAction.PROGRESS`;
  static PAUSE = `PlaylistAction.PAUSE`;

  static ADDING_TRACK = `PlaylistAction.ADDING_TRACK`;
  static ADDING_TRACK_SUCCESS = `PlaylistAction.ADDING_TRACK_SUCCESS`;
  static ADDING_TRACK_ERROR = `PlaylistAction.ADDING_TRACK_ERROR`;
  static ADD_TRACK = `PlaylistAction.ADD_TRACK`;

  /**
   * `UPDATE_TRACK` is to be used when a track is simply being updated.
   *
   * @type {string}
   */
  static UPDATE_TRACK = `PlaylistAction.UPDATE_TRACK`;

}
