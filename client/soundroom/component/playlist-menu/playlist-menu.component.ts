import {Component, ViewEncapsulation} from 'angular2/core';
import {OnInit} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";
import {PlaylistMenuItemComponent} from "../../component/playlist-menu-item/playlist-menu-item.component";
import {CountPipe} from "../../pipe/CountPipe";

@Component({
  selector: 'playlist-menu',
  templateUrl: 'soundroom/component/playlist-menu/playlist-menu.html',
  styleUrls: ['soundroom/component/playlist-menu/playlist-menu.css'],
  directives: [PlaylistMenuItemComponent],
  pipes: [CountPipe]
})
export class PlaylistMenuComponent implements OnInit {

  private playlists:Observable<Array<Playlist>>;
  private errorMessage:any;

  constructor( private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    this.playlists = this.playlistService.playlists;

    // Subscribe not necessary due to use of AsyncPipe in template, but may be useful for catching errors later
    //this.playlists.subscribe(
    //  data => console.log('PlaylistMenuComponent.ngOnInit(): subscribe:', data),
    //  error => {
    //    // TODO: Handle error message in UI
    //    this.errorMessage = <any>error;
    //  }
    //);

  }
}
