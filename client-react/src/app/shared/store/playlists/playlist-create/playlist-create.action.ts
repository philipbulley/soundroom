import { PlaylistsActionType } from '../playlists-action-type';

export const playlistCreateAction = (payload: PlaylistCreateParams): PlaylistCreateAction => ({
  type: PlaylistsActionType.PLAYLIST_CREATE,
  payload,
});

export interface PlaylistCreateAction {
  type: PlaylistsActionType.PLAYLIST_CREATE;
  payload: PlaylistCreateParams;
}

export interface PlaylistCreateParams {
  name: string;
  description: string;
}
