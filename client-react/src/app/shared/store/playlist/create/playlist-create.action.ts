
import { PlaylistActionType } from '../playlist-action-types';

export const playlistCreateAction = (payload: PlaylistCreateParams): PlaylistCreateAction => ({
  type: PlaylistActionType.CREATE,
  payload,
});

export interface PlaylistCreateAction {
  type: PlaylistActionType.CREATE;
  payload: PlaylistCreateParams;
}

export interface PlaylistCreateParams {
  name: string;
  description: string;
}
