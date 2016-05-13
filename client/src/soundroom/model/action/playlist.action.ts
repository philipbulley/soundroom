export class PlaylistAction {

  static LOADING = `PlaylistAction.LOAD`;
  static ERROR_LOADING = `PlaylistAction.ERROR_LOADING`;

  static PROGRESS = `PlaylistAction.PROGRESS`;
  static PAUSE = `PlaylistAction.PAUSE`;

  static ADDING_TRACK = `PlaylistAction.ADDING_TRACK`;
  static ADD_TRACK = `PlaylistAction.ADD_TRACK`;
  static ERROR_ADDING_TRACK = `PlaylistAction.ERROR_ADDING_TRACK`;

  /**
   * `UPDATE_TRACK` is to be used when a track is simply being updated. 
   * 
   * @type {string}
   */
  static UPDATE_TRACK = `PlaylistAction.UPDATE_TRACK`;

}
