import { PlaylistTrack } from '../../model/playlist-track';

export interface TrackUpdatePayload {
  playlistId: string;
  playlistTrack: PlaylistTrack;
  playlistTrackIds: string[];
}
