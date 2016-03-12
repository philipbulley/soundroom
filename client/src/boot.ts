import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {provideStore} from '@ngrx/store';
//import * as devtools from '@ngrx/devtools'

import {SoundroomComponent} from './soundroom/soundroom.component';
import {playlistCollectionReducer} from "./soundroom/model/reducers/playlist-collection.reducer";
import {playlistCreateReducer} from "./soundroom/model/reducers/playlist-create.reducer";

//let enhanced = devtools.instrument()(createStore);

bootstrap(SoundroomComponent, [
  provideStore({
    playlistsCollection: playlistCollectionReducer,
    playlistCreate: playlistCreateReducer
  }),
  ROUTER_PROVIDERS
])
  .catch(err => console.error(err));
