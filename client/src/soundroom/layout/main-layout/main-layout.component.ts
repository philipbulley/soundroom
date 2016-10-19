import {Component, ChangeDetectionStrategy} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

import {PlaylistMenuComponent} from "../../component/playlist-menu/playlist-menu.component";
import {PlaylistCollection} from "../../model/playlist-collection";
import {PlaylistService} from "../../service/playlist.service";
import {AppState} from "../../../boot";
import {NowPlayingPreviewComponent} from "../../component/now-playing-preview/now-playing-preview.component";

@Component({
  selector: 'main-layout',
  template: require('./main-layout.html'),
  styles: [require('./main-layout.scss')],
  directives: [PlaylistMenuComponent, NowPlayingPreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {

  private playlistCollection$:Observable<PlaylistCollection>;

  constructor( private store$:Store<AppState>, private playlistService:PlaylistService ) {

    this.playlistCollection$ = this.store$.map((state: AppState) => state.playlistCollection);
    // this.playlistCollection$.subscribe(data => console.log('MainLayout.playlistCollection: data:', data));   // debug!

    this.playlistService.loadCollection();

  }
}
