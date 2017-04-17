import { ErrorKey } from './error-key';
import { Playlist } from '../playlist';
import { PlaylistTrack } from '../playlist-track';
import { ErrorResult } from './error-result';

export interface PlaylistTrackErrorResult extends ErrorResult {
  playlist: Playlist;
  playlistTrack: PlaylistTrack;
  type: ErrorKey,
}
