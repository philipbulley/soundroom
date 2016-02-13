import {Component, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectionStrategy} from 'angular2/core';

import {Observable, Subscription} from 'rxjs/Observable';
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
  pipes: [CountPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistMenuComponent implements OnInit, OnDestroy {
  private playlists:Observable<Playlist[]>;
  private isSlowConnection:boolean = false;
  private errorMessage:any;
  private onSlowConnectionSubscription:Subscription<boolean>;
  private playlistsSubscription:Subscription<Playlist[]>;

  constructor( private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    this.onSlowConnectionSubscription = this.playlistService.onSlowConnection.subscribe(
      ( isSlow:boolean ) => this.handleSlowConnection(isSlow)
    );

    this.playlists = this.playlistService.playlists;

    // Subscribe so we can catch errors
    this.playlistsSubscription = this.playlists.subscribe(
      data => console.log('PlaylistMenuComponent.ngOnInit(): subscribe:', data),
      error => {
        alertify.error("Can't load Soundrooms. Try again later.");
        this.errorMessage = <any>error;
      }
    );
  }

  ngOnDestroy():any {
    this.onSlowConnectionSubscription.unsubscribe();
    this.playlistsSubscription.unsubscribe();
  }

  private handleSlowConnection( isSlow:boolean ) {
    console.log("PlaylistMenuComponent.onSlowConnection()", isSlow);

    this.isSlowConnection = isSlow;

    if (isSlow) {
      alertify.log("<i class=\"fa fa-wifi\"></i> There are problems with your connection, we'll keep trying.");
    }
  }

}
