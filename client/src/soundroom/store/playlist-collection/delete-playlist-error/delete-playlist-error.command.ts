import { PlaylistCollection } from "../../../model/playlist-collection";
import { ErrorResult } from "../../../model/error-result";

export const deletePlaylistErrorCommand = (state: PlaylistCollection, payload: ErrorResult): PlaylistCollection => {

	state = Object.assign({}, state);
  state.loadState = null;

	return state;
};
