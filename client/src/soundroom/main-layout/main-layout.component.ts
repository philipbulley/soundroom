import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { PlaylistCollection } from '../shared/model/playlist-collection';
import { AppState } from '../shared/model/app-state';
import { LoadPlaylistCollectionAction } from '../shared/store/playlist-collection/load-playlist-collection/load-playlist-collection.action';

@Component({
  selector: 'sr-main-layout',
  template: require('./main-layout.component.html'),
  styles: [require('./main-layout.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {

  private playlistCollection$: Observable<PlaylistCollection>;

  constructor(private store$: Store<AppState>) {
    //
  }

  ngOnInit() {
    this.playlistCollection$ = this.store$.select((state: AppState) => state.playlistCollection);

    this.store$.dispatch(new LoadPlaylistCollectionAction());
  }
}
