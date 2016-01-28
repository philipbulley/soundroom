import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import 'rxjs/Rx';

import {MainLayout} from "./layout/main/main.component";
import {PlaylistService} from "./service/playlist.service";

@Component({
  selector: 'soundroom',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'soundroom/soundroom.html',
  providers: [PlaylistService]
})
@RouteConfig([
  {path: '/', name: 'MainLayout', component: MainLayout, useAsDefault: true}
])
export class SoundroomComponent {

}
