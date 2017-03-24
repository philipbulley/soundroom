import { PlaylistTrack } from '../../../model/playlist-track';
import { Playlist } from '../../../model/playlist';

export interface TrackUpVotePayload {
  playlist: Playlist;
  playlistTrack: PlaylistTrack;
}
