import { ErrorResult } from '../../error/error-result';

export interface Playlists {
  items: PlaylistsItem[];
  loading: boolean;
  error?: ErrorResult;
}

export interface PlaylistsItem {
  _id: string;
  created: string;
  modified: string;
  description: string;
  name: string;
}
