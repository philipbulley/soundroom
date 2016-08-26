import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { playlistReducer } from "../model/reducers/playlist.reducer";
import { playlistCollectionReducer } from "../model/reducers/playlist-collection.reducer";
import { playlistCreateReducer } from "../model/reducers/playlist-create.reducer";
import { authReducer } from "./auth/auth.reducer";

const REDUCERS = {
  playlist: playlistReducer,
  playlistsCollection: playlistCollectionReducer,
  playlistCreate: playlistCreateReducer,
  auth: authReducer
};

export const STORE_REDUCERS = compose(storeLogger(), combineReducers)(REDUCERS);
