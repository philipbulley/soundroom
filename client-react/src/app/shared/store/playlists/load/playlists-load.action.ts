import { PlaylistsActionType } from '../playlists-action-type';

export const playlistsLoadAction = (): PlaylistsLoadAction => ({
  type: PlaylistsActionType.LOAD,
});

export interface PlaylistsLoadAction {
  type: PlaylistsActionType.LOAD;
}
