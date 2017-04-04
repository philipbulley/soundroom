import { PlaylistCollection } from '../../../model/playlist-collection';
import { DeleteTrackPayload } from '../delete-track/delete-track-payload';
import { resetPlaylistLoadStateCommand } from '../reset-playlist-load-state.command';

export const deleteTrackSuccessCommand = (state: PlaylistCollection, payload: DeleteTrackPayload): PlaylistCollection => {
  // NOTE: The track is only removed from the store once we receive the TrackDeletedAction (ie. the action based on
  // socket event to all clients)

  state = Object.assign({}, state);

  state = resetPlaylistLoadStateCommand(state, payload.playlist._id);

  return state;
};
