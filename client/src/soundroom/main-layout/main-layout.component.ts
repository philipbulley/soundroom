import {Component, ChangeDetectionStrategy} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import { PlaylistCollection } from '../shared/model/playlist-collection';
import { AppState } from '../shared/model/app-state';
import { PlaylistService } from '../shared/service/playlist.service';

@Component({
  selector: 'main-layout',
  template: require('./main-layout.html'),
  styles: [require('./main-layout.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {

  private playlistCollection$:Observable<PlaylistCollection>;

  constructor( private store$:Store<AppState>, private playlistService:PlaylistService ) {

    this.playlistCollection$ = this.store$.map((state: AppState) => state.playlistCollection);
    // this.playlistCollection$.subscribe(data => console.log('MainLayoutComponent.playlistCollection: data:', data));   // debug!

    this.playlistService.loadCollection();

  }
}
