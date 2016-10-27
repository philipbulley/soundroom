import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PlaylistService } from '../../shared/service/playlist.service';
import { PlaylistCollection } from '../../shared/model/playlist-collection';
import { PlaylistCollectionState } from '../../shared/model/state/playlist-collection.state';

var alertify = require('alertify.js');

@Component({
  selector: 'playlist-menu',
  template: require('./playlist-menu.html'),
  styles: [require('./playlist-menu.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistMenuComponent implements OnInit, OnDestroy {

  /* tslint:disable:no-unused-variable */
  @Input() private playlistCollection: PlaylistCollection;

  private PlaylistCollectionState = PlaylistCollectionState;
  /* tslint:enable:no-unused-variable */

  private isSlowConnection: boolean = false;
  private onSlowConnectionSubscription: Subscription;

  constructor(private playlistService: PlaylistService) {
    //
  }

  ngOnInit(): any {
    // TODO: Move slow connection to state tree
    this.onSlowConnectionSubscription = this.playlistService.onSlowConnection.subscribe(
      (isSlow: boolean) => this.handleSlowConnection(isSlow)
    );
  }

  ngOnDestroy(): any {
    this.onSlowConnectionSubscription.unsubscribe();
  }

  private handleSlowConnection(isSlow: boolean) {
    // console.log("PlaylistMenuComponent.handleSlowConnection()", isSlow);

    this.isSlowConnection = isSlow;

    if (isSlow) {
      console.log('// TODO: Show alertify dialog');
      alertify.log("<i class=\"fa fa-wifi\"></i> There are problems with your connection, we'll keep trying.");
    }
  }
}
