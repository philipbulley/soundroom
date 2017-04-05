import { ErrorKey } from '../../../model/error/error-key';
import { Playlist } from '../../../model/playlist';
import { PlaylistTrack } from '../../../model/playlist-track';
import { ErrorResult } from '../../../model/error/error-result';

export interface DeleteTrackErrorResult extends ErrorResult {
  playlist: Playlist;
  playlistTrack: PlaylistTrack;
  type: ErrorKey,
}
