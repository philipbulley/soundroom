import { PlaylistCollectionState } from "../../../model/state/playlist-collection.state";
import { PlaylistCollection } from "../../../model/playlist-collection";
import { LoadPlaylistCollectionParams } from "./load-playlist-collection-params";

export const loadPlaylistCollectionCommand = (state: PlaylistCollection, payload: LoadPlaylistCollectionParams): PlaylistCollection => {

	state = Object.assign({}, state);
  state.loadState = PlaylistCollectionState.LOADING;

	return state;
};
