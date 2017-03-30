export enum PlaylistError {

  /** When we can't connect to the provider  */
  PROVIDER_CONNECTION = 'PlaylistError.PROVIDER_CONNECTION' as any as PlaylistError,

  /** When a user has attempted to up-vote a track more than once */
  DUPLICATE_USER_UP_VOTE = 'PlaylistError.DUPLICATE_USER_UP_VOTE' as any as PlaylistError,

  PLAYLIST_COLLECTION_NOT_FOUND = 'PlaylistError.PLAYLIST_COLLECTION_NOT_FOUND' as any as PlaylistError,

  /** Unspecified server error  */
  SERVER = 'PlaylistError.SERVER' as any as PlaylistError,

  /** Unspecified server error  */
  UNKNOWN = 'PlaylistError.UNKNOWN' as any as PlaylistError,

}
