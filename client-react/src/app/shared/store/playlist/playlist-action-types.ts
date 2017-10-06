import { PlaylistCreateAction } from './create/playlist-create.action';

export enum PlaylistActionType {
  CREATE = 'CREATE',
}

export type PlaylistActions = PlaylistCreateAction;
