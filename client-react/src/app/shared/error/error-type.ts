export enum ErrorType {
  // GENERIC
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',

  // SPECIFIC
  PLAYLIST_NOT_FOUND = 'PLAYLIST_NOT_FOUND',
  /** When we can't connect to the provider  */
  PROVIDER_CONNECTION = 'PROVIDER_CONNECTION',
  /** When a user has attempted to up-vote a track more than once */
  DUPLICATE_USER_UP_VOTE = 'DUPLICATE_USER_UP_VOTE',
  PLAYLISTS_NOT_FOUND = 'PLAYLISTS_NOT_FOUND',
}
