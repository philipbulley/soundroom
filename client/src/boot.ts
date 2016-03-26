import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {BrowserXhr} from 'angular2/http';

import {provideStore} from '@ngrx/store';
//import * as devtools from '@ngrx/devtools'

import {SoundroomComponent} from './soundroom/soundroom.component';
import {playlistCollectionReducer} from "./soundroom/model/reducers/playlist-collection.reducer";
import {playlistReducer} from "./soundroom/model/reducers/playlist.reducer";
import {playlistCreateReducer} from "./soundroom/model/reducers/playlist-create.reducer";
import {authReducer} from "./soundroom/model/reducers/auth.reducer";
import {WithCredentialsBrowserXhr} from "./soundroom/extend/with-credentials-browser-xhr";

//let enhanced = devtools.instrument()(createStore);

bootstrap(SoundroomComponent, [
  provideStore({
    playlist: playlistReducer,
    playlistsCollection: playlistCollectionReducer,
    playlistCreate: playlistCreateReducer,
    auth: authReducer
  }),
  // provide(BrowserXhr, {useClass:WithCredentialsBrowserXhr}),
  ...ROUTER_PROVIDERS
])
  .catch(err => console.error(err));
