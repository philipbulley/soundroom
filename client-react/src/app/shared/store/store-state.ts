import { Playlists } from './playlists/playlists';
import { Auth } from './auth/auth';

export interface StoreState {
  playlists: Playlists;
  auth: Auth;
}
