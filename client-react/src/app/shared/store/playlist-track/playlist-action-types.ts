import { PlaylistCreateAction } from '../playlists/playlist-create/playlist-create.action';

export enum PlaylistActionType {
  CREATE = 'CREATE',
}

export type PlaylistActions = PlaylistCreateAction;
