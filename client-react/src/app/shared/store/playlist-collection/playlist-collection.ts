import { ErrorResult } from '../../error/error-result';

export interface PlaylistCollection {
  items: PlaylistCollectionItem[];
  loading: boolean;
  error?: ErrorResult;
}

export interface PlaylistCollectionItem {
  _id: string;
  created: string;
  modified: string;
  description: string;
  name: string;
}
