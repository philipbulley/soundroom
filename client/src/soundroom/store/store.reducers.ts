import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { playlistCollectionReducer } from "./playlist-collection/playlist-collection.reducer";
import { playlistCreateReducer } from "../model/reducers/playlist-create.reducer";
import { authReducer } from "./auth/auth.reducer";

const REDUCERS = {
  playlistsCollection: playlistCollectionReducer,
  playlistCreate: playlistCreateReducer,
  auth: authReducer,
};

export const STORE_REDUCERS = compose(storeLogger(), combineReducers)(REDUCERS);
