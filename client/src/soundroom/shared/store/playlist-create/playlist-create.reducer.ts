import { ActionReducer } from '@ngrx/store';
import { PlaylistCreate } from '../../model/playlist-create';
import { PlaylistCreateState } from '../../model/state/playlist-create.state.ts';
import { CommandReducer } from '../../../../shared/reducer/command-reducer';
import { PlaylistCreateResetAction } from './reset/playlist-create-reset.action';
import { playlistCreateResetCommand } from './reset/playlist-create-reset.command';
import { PlaylistCreateStartAction } from './start/playlist-create-start.action';
import { playlistCreateStartCommand } from './start/playlist-create-start.command';
import { PlaylistCreateAddNameAction } from './add-name/playlist-create-add-name.action';
import { playlistCreateAddNameCommand } from './add-name/playlist-create-add-name.command';
import { PlaylistCreateAddDescriptionCreateAction } from './add-description-create/playlist-create-add-description-create.action';
import { playlistCreateAddDescriptionCreateCommand } from './add-description-create/playlist-create-add-description-create.command';
import { PlaylistCreateErrorAction } from './error/playlist-create-error.action';
import { playlistCreateErrorCommand } from './error/playlist-create-error.command';
import { PlaylistCreateSuccessAction } from './success/playlist-create-success.action';
import { playlistCreateSuccessCommand } from './success/playlist-create-success.command';

const DEFAULT_STATE: PlaylistCreate = {
  state: PlaylistCreateState.DEFAULT,
  name: null,
  description: null,
  playlistCreated: null,
};

export const playlistCreateReducer: ActionReducer<PlaylistCreate> = new CommandReducer<PlaylistCreate>(DEFAULT_STATE)
  .add(PlaylistCreateResetAction, playlistCreateResetCommand)
  .add(PlaylistCreateStartAction, playlistCreateStartCommand)
  .add(PlaylistCreateAddNameAction, playlistCreateAddNameCommand)
  .add(PlaylistCreateAddDescriptionCreateAction, playlistCreateAddDescriptionCreateCommand)
  .add(PlaylistCreateErrorAction, playlistCreateErrorCommand)
  .add(PlaylistCreateSuccessAction, playlistCreateSuccessCommand)
  .reducer();
