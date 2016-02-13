import {Component, ViewEncapsulation, OnInit, OnDestroy} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import * as alertify from "alertify"

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";
import {PlaylistMenuItemComponent} from "../../component/playlist-menu-item/playlist-menu-item.component";
import {CountPipe} from "../../pipe/CountPipe";
import {PlaylistCreateComponent} from "../playlist-create/playlist-create.component";

@Component({
  selector: 'playlist-menu',
  templateUrl: 'soundroom/component/playlist-menu/playlist-menu.html',
  styleUrls: ['soundroom/component/playlist-menu/playlist-menu.css'],
  directives: [PlaylistMenuItemComponent, PlaylistCreateComponent],
  pipes: [CountPipe]
})
export class PlaylistMenuComponent implements OnInit, OnDestroy {
  private playlists:Observable<Array<Playlist>>;
  private isSlowConnection:boolean = false;
  private errorMessage:any;

  constructor( private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    this.playlistService.onSlowConnection.subscribe(( isSlow:boolean ) => this.handleSlowConnection(isSlow));
    this.playlists = this.playlistService.playlists;

    // Subscribe not necessary due to use of AsyncPipe in template, but may be useful for catching errors later
    this.playlists.subscribe(
      data => console.log('PlaylistMenuComponent.ngOnInit(): subscribe:', data),
      error => {
        alertify.error("Can't load Soundrooms. Try again later.");
        this.errorMessage = <any>error;
      }
    );

    //setTimeout(()=>{
    //  // DEBUG!
    //  console.log('attempt to call playlistService.create');
    //  this.playlistService.create('Room 1')
    //    .subscribe(( success ) => {
    //      // success should really always be true, otherwise we should have errored
    //      alertify.success("Yay! You've created a new room!");
    //      console.log('PlaylistMenuItemComponent.deletePlaylist() subscribe: success', success);
    //    },
    //    error => {
    //      alertify.error("Can't couldn't create a new room. Try again later.");
    //      //this.isDeleting = false;
    //      this.errorMessage = <any>error;
    //    });
    //}, 1000);
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
