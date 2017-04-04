import { PlaylistCollection } from '../../../model/playlist-collection';
import { DeleteTrackPayload } from '../delete-track/delete-track-payload';
import { resetPlaylistLoadStateCommand } from '../reset-playlist-load-state.command';

export const deleteTrackErrorCommand = (state: PlaylistCollection, payload: DeleteTrackPayload): PlaylistCollection => {
  state = Object.assign({}, state);

  state = resetPlaylistLoadStateCommand(state, payload.playlist._id);

  return state;
};
