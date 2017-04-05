import { ErrorResult } from './error-result';
import { ErrorKey } from './error-key';

export interface PlaylistErrorResult extends ErrorResult {
  playlistId: string;
  type: ErrorKey,
}
