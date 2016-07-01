import {bootstrap} from '@angular/platform-browser-dynamic';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {provideStore} from '@ngrx/store';

import {SoundroomComponent} from './soundroom/soundroom.component';
import {playlistCollectionReducer} from "./soundroom/model/reducers/playlist-collection.reducer";
import {playlistReducer} from "./soundroom/model/reducers/playlist.reducer";
import {playlistCreateReducer} from "./soundroom/model/reducers/playlist-create.reducer";
import {authReducer} from "./soundroom/model/reducers/auth.reducer";
import {APP_ROUTER_PROVIDERS} from "./soundroom/soundroom.routes";
import {Playlist} from "./soundroom/model/playlist";
import {PlaylistCollection} from "./soundroom/model/playlist-collection";
import {PlaylistCreate} from "./soundroom/model/playlist-create";
import {Auth} from "./soundroom/model/auth";

export interface AppState {
  playlist:Playlist,
  playlistsCollection:PlaylistCollection,
  playlistCreate:PlaylistCreate,
  auth:Auth
}

bootstrap(SoundroomComponent, [
  provideStore({
    playlist: playlistReducer,
    playlistsCollection: playlistCollectionReducer,
    playlistCreate: playlistCreateReducer,
    auth: authReducer
  }),
  APP_ROUTER_PROVIDERS//,
  // {provide: LocationStrategy, useClass: HashLocationStrategy} // use #/ routes, remove this for HTML5 mode
])
  .catch(err => console.error(err));

