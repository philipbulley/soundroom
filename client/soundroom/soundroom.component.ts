import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import 'rxjs/Rx';
import * as alertify from 'alertify';

import {MainLayout} from "./layout/main-layout/main-layout.component";
import {PlaylistService} from "./service/playlist.service";
import {PlaylistLayout} from "./layout/playlist-layout/playlist-layout.component";

@Component({
  selector: 'soundroom',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'soundroom/soundroom.html',
  providers: [HTTP_PROVIDERS, PlaylistService],
  styleUrls: ['soundroom/soundroom.css']
})
@RouteConfig([
  {path: '/', name: 'MainLayout', component: MainLayout, useAsDefault: true},
  {path: '/playlist/:id', name: 'PlaylistLayout', component: PlaylistLayout},
])
export class SoundroomComponent {
  constructor() {

    // Global config for alertify
    alertify.logPosition("top right");
    alertify.delay(8000);

  }
}
