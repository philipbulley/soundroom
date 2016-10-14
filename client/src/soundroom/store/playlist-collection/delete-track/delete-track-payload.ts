import { Playlist } from '../../../model/playlist';
import { PlaylistTrack } from '../../../model/playlist-track';

export interface DeleteTrackPayload {
  playlist: Playlist;
  playlistTrack: PlaylistTrack;
}
