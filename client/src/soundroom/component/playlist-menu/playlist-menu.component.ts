import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
var alertify = require('alertify.js');

import {PlaylistService} from "../../service/playlist.service";
import {PlaylistMenuItemComponent} from "../../component/playlist-menu-item/playlist-menu-item.component";
import {CountPipe} from "../../pipe/count.pipe";
import {PlaylistCreateComponent} from "../playlist-create/playlist-create.component";
import {PlaylistCollection} from "../../model/playlist-collection";

@Component({
  selector: 'playlist-menu',
  template: require('./playlist-menu.html'),
  styles: [require('./playlist-menu.scss')],
  directives: [PlaylistMenuItemComponent, PlaylistCreateComponent],
  pipes: [CountPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistMenuComponent implements OnInit, OnDestroy {

  /* tslint:disable:no-unused-variable */
  @Input()
  private playlistCollection:Observable<PlaylistCollection>;
  /* tslint:enable:no-unused-variable */

  private isSlowConnection:boolean = false;
  private onSlowConnectionSubscription:Subscription;

  constructor( private playlistService:PlaylistService ) {
    //
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
    // console.log("PlaylistMenuComponent.handleSlowConnection()", isSlow);

    this.isSlowConnection = isSlow;

    if (isSlow) {
      console.log('// TODO: Show alertify dialog');
      alertify.log("<i class=\"fa fa-wifi\"></i> There are problems with your connection, we'll keep trying.");
    }
  }

}
