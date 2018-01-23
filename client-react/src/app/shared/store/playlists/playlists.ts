import { ErrorResult } from '../../error/error-result';
import { Playlist } from '../../model/playlist';

export interface Playlists {
  items: Playlist[];
  loading: boolean;
  error?: ErrorResult;
}
