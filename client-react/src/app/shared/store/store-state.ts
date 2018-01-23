import { Playlists } from './playlists/playlists';
import { Auth } from './auth/auth';
import { PlaylistTracks } from './playlist-tracks/playlist-tracks';

export interface StoreState {
  playlists: Playlists;
  playlistTracks: PlaylistTracks;
  auth: Auth;
}
