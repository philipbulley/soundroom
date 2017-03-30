import { ErrorResult } from './error-result';
import { PlaylistError } from './playlist-error';

export interface PlaylistErrorResult extends ErrorResult {
  playlistId: string;
  type: PlaylistError,
}
