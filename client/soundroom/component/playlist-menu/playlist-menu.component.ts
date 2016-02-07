import {Component, ViewEncapsulation} from 'angular2/core';
import {OnInit, OnDestroy} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import * as alertify from "alertify"

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
export class PlaylistMenuComponent implements OnInit, OnDestroy {
  private playlists:Observable<Array<Playlist>>;
  private isSlowConnection:boolean = false;
  private errorMessage:any;

  constructor( private playlistService:PlaylistService ) {
    console.log('alertify:', alertify);
  }

  ngOnInit():any {
    this.playlistService.onSlowConnection.subscribe(isSlow => this.handleSlowConnection(isSlow));
    this.playlists = this.playlistService.playlists;

    // Subscribe not necessary due to use of AsyncPipe in template, but may be useful for catching errors later
    this.playlists.subscribe(
      data => console.log('PlaylistMenuComponent.ngOnInit(): subscribe:', data),
      error => {
        alertify.error("Can't load Soundrooms. Try again later.");
        this.errorMessage = <any>error;
      }
    );
  }

  ngOnDestroy():any {
    this.playlistService.onSlowConnection.unsubscribe();
  }

  private handleSlowConnection( isSlow:boolean ) {
    console.log("PlaylistMenuComponent.onSlowConnection()", isSlow);

    this.isSlowConnection = isSlow;

    if (isSlow) {
      alertify.log("<i class=\"fa fa-wifi\"></i> There are problems with your connection, we'll keep trying.");
    }
  }

}
