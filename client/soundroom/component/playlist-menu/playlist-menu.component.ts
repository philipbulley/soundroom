import {Component, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectionStrategy, Input} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import * as alertify from "alertify"
import {Store} from '@ngrx/store';

import {PlaylistService} from "../../service/playlist.service";
import {PlaylistMenuItemComponent} from "../../component/playlist-menu-item/playlist-menu-item.component";
import {CountPipe} from "../../pipe/CountPipe";
import {PlaylistCreateComponent} from "../playlist-create/playlist-create.component";
import {PlaylistCollection} from "../../model/playlist-collection";
import {PlaylistCreate} from "../../model/playlist-create";

@Component({
  selector: 'playlist-menu',
  templateUrl: 'soundroom/component/playlist-menu/playlist-menu.html',
  styleUrls: ['soundroom/component/playlist-menu/playlist-menu.css'],
  directives: [PlaylistMenuItemComponent, PlaylistCreateComponent],
  pipes: [CountPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistMenuComponent implements OnInit, OnDestroy {

  @Input()
  private playlistCollection:Observable<PlaylistCollection>;

  private isSlowConnection:boolean = false;
  private onSlowConnectionSubscription:Subscription;
  private playlistCreate$:Observable<PlaylistCreate>;

  constructor( private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    // TODO: Move slow connection to state tree
    this.onSlowConnectionSubscription = this.playlistService.onSlowConnection.subscribe(
      ( isSlow:boolean ) => this.handleSlowConnection(isSlow)
    );
  }

  ngOnDestroy():any {
    this.onSlowConnectionSubscription.unsubscribe();
  }

  private handleSlowConnection( isSlow:boolean ) {
    console.log("PlaylistMenuComponent.onSlowConnection()", isSlow);

    this.isSlowConnection = isSlow;

    if (isSlow) {
      alertify.log("<i class=\"fa fa-wifi\"></i> There are problems with your connection, we'll keep trying.");
    }
  }

}
