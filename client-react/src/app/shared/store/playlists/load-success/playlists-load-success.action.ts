import { PlaylistsActionType } from '../playlists-action-type';
import { PlaylistsItem } from '../playlists';

export const playlistsLoadSuccessAction =
  (payload: PlaylistsItem[]): PlaylistsLoadSuccessAction => ({
    type: PlaylistsActionType.LOAD_SUCCESS,
    payload,
  });

export interface PlaylistsLoadSuccessAction {
  type: PlaylistsActionType.LOAD_SUCCESS;
  payload: PlaylistsItem[];
}
