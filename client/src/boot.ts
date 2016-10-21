import { bootstrap } from '@angular/platform-browser-dynamic';
// import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { HTTP_PROVIDERS } from '@angular/http';

import { provideStore } from '@ngrx/store';

import { SoundroomComponent } from './soundroom/soundroom.component';
import { Playlist } from "./soundroom/shared/model/playlist";
import { PlaylistCollection } from "./soundroom/shared/model/playlist-collection";
import { PlaylistCreate } from "./soundroom/shared/model/playlist-create";
import { Auth } from "./soundroom/shared/model/auth";
import { SocketService } from "./soundroom/shared/service/socket.service";
import { NetworkService } from "./soundroom/shared/service/network.service";
import { AuthService } from "./soundroom/shared/service/auth.service";
import { APP_ROUTER_PROVIDERS } from "./soundroom/soundroom.routes";
import { STORE_REDUCERS } from "./soundroom/shared/store/store.reducers";

export interface AppState {
  playlist: Playlist;
  playlistCollection: PlaylistCollection;
  playlistCreate: PlaylistCreate;
  auth: Auth;
}

bootstrap(SoundroomComponent, [
  provideStore(STORE_REDUCERS),
  HTTP_PROVIDERS,
  APP_ROUTER_PROVIDERS,
  AuthService,
  NetworkService,
  SocketService,
  //,
  // {provide: LocationStrategy, useClass: HashLocationStrategy} // use #/ routes, remove this for HTML5 mode
])
  .catch(err => console.error(err));

