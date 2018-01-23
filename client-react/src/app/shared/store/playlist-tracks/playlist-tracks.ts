import { ErrorResult } from '../../error/error-result';
import { PlaylistTrack } from '../../model/playlist-track';

export interface PlaylistTracks {
  tracks: { [_id: string]: PlaylistTrack };
  loading: boolean;
  error?: ErrorResult;
}
