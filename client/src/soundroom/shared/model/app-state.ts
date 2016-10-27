import { Auth } from './auth';
import { PlaylistCreate } from './playlist-create';
import { PlaylistCollection } from './playlist-collection';
import { Playlist } from './playlist';

export interface AppState {
  playlist: Playlist;
  playlistCollection: PlaylistCollection;
  playlistCreate: PlaylistCreate;
  auth: Auth;
}
