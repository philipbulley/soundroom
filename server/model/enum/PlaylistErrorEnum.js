// TODO: Create and extend DocumentErrorEnum
const PlaylistErrorEnum = {

  ALREADY_EXISTS: 'ALREADY_EXISTS',

  NOT_FOUND: 'NOT_FOUND',

  INVALID_ID: 'INVALID_ID',

  TRACK_NOT_IN_PLAYLIST: 'TRACK_NOT_IN_PLAYLIST',

  /**
   * The attempted up vote is a duplicate. The user has already up voted the specified playlist track.
   */
  DUPLICATE_USER_UP_VOTE: 'DUPLICATE_USER_UP_VOTE'

};

export default PlaylistErrorEnum;
