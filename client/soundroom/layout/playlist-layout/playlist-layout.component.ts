import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {PlaylistMenuComponent} from "../../component/playlist-menu/playlist-menu.component";

@Component({
  selector: 'playlist-layout',
  templateUrl: 'soundroom/layout/playlist-layout/playlist-layout.html',
  styleUrls: ['soundroom/layout/playlist-layout/playlist-layout.css'],
  directives: [PlaylistMenuComponent]
})
export class PlaylistLayout {

  private id:string;

  constructor( private routeParams:RouteParams ) {
    this.id = routeParams.get('id');
  }
}
