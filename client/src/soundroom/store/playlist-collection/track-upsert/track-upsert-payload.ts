import { PlaylistTrack } from '../../../model/playlist-track';

export interface TrackUpsertPayload {
  playlistId: string;
  playlistTrack: PlaylistTrack;
  playlistTrackIds: string[];
}
