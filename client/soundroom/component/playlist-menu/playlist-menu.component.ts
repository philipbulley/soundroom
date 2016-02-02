import {Component, ViewEncapsulation} from 'angular2/core';
import {OnInit} from 'angular2/core';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";
import {PlaylistMenuItemComponent} from "../../component/playlist-menu-item/playlist-menu-item.component";

@Component({
  selector: 'playlist-menu',
  templateUrl: 'soundroom/component/playlist-menu/playlist-menu.html',
  styleUrls: ['soundroom/component/playlist-menu/playlist-menu.css'],
  directives: [PlaylistMenuItemComponent]
})
export class PlaylistMenuComponent implements OnInit {

  private playlists:Playlist[];
  private errorMessage:any;

  constructor( private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    return this.playlistService.getPlaylists()
      .subscribe(playlists => this.playlists = playlists,
        error => this.errorMessage = <any>error);
    // TODO: Handle error message in UI
  }
}
