import {Component} from 'angular2/core';

import {PlaylistMenuComponent} from "../../component/playlist-menu/playlist-menu.component";

@Component({
  selector: 'main',
  templateUrl: 'soundroom/layout/main/main.html',
  styleUrls: ['soundroom/layout/main/main.css'],
  directives: [PlaylistMenuComponent]
})
export class MainLayout {

}
