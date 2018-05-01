import { playlistsLoadEpic } from './load/playlists-load.epic';
import { playlistCreateEpic } from './playlist-create/playlist-create.epic';

export const playlistsEpics = [playlistsLoadEpic, playlistCreateEpic];
