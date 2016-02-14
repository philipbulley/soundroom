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

    console.log('%c♪ ♫ ♬  Soundroom  ♬ ♫ ♪', 'background-color:#3fa2db;color:#fff;padding:20px 20px;font-size:30px;font-weight:bold;text-align:center;text-shadow:0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15)');
    console.log('%c'+new Date, 'color:#fff;padding:0 20px');

    // Global config for alertify
    alertify.logPosition("top right");
    alertify.delay(8000);

  }
}
