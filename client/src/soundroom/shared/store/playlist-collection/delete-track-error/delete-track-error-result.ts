import { PlaylistError } from '../../../model/error/playlist-error';
import { Playlist } from '../../../model/playlist';
import { PlaylistTrack } from '../../../model/playlist-track';
import { ErrorResult } from '../../../model/error/error-result';

export interface DeleteTrackErrorResult extends ErrorResult {
  playlist: Playlist;
  playlistTrack: PlaylistTrack;
  type: PlaylistError,
}
