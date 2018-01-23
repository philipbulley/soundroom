import { PlaylistsActionType } from '../playlists-action-type';

export const playlistCreateAction = (payload: PlaylistCreateParams): PlaylistCreateAction => ({
  type: PlaylistsActionType.CREATE,
  payload,
});

export interface PlaylistCreateAction {
  type: PlaylistsActionType.CREATE;
  payload: PlaylistCreateParams;
}

export interface PlaylistCreateParams {
  name: string;
  description: string;
}
