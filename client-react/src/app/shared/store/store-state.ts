import { PlaylistCollection } from './playlist-collection/playlist-collection';
import { Auth } from './auth/auth';

export interface StoreState {
  playlistCollection: PlaylistCollection,
  auth: Auth,
}
