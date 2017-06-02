export enum ErrorKey {
  PLAYLIST_NOT_FOUND = 'PLAYLIST_NOT_FOUND' as any as ErrorKey,

  /** When we can't connect to the provider  */
  PROVIDER_CONNECTION = 'PROVIDER_CONNECTION' as any as ErrorKey,

  /** When a user has attempted to up-vote a track more than once */
  DUPLICATE_USER_UP_VOTE = 'DUPLICATE_USER_UP_VOTE' as any as ErrorKey,

  PLAYLIST_COLLECTION_NOT_FOUND = 'PLAYLIST_COLLECTION_NOT_FOUND' as any as ErrorKey,

  /** Unspecified server error  */
  SERVER = 'SERVER' as any as ErrorKey,

  /** Unspecified server error  */
  UNKNOWN = 'UNKNOWN' as any as ErrorKey,
}
