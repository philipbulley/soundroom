import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PlaylistCollection } from '../../shared/model/playlist-collection';
import { PlaylistCollectionState } from '../../shared/model/state/playlist-collection.state';

@Component({
  selector: 'sr-playlist-menu',
  template: require('./playlist-menu.component.html'),
  styles: [require('./playlist-menu.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistMenuComponent {

  /* tslint:disable:no-unused-variable */
  @Input() private playlistCollection: PlaylistCollection;

  private PlaylistCollectionState = PlaylistCollectionState;
  /* tslint:enable:no-unused-variable */


  constructor() {
    //
  }
}
