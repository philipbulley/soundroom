import {Component} from 'angular2/core';

import {PlaylistMenuComponent} from "../../component/playlist-menu/playlist-menu.component";

@Component({
  selector: 'main-layout',
  templateUrl: 'soundroom/layout/main-layout/main-layout.html',
  styleUrls: ['soundroom/layout/main-layout/main-layout.css'],
  directives: [PlaylistMenuComponent]
})
export class MainLayout {

}
