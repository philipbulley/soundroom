import {Component, ChangeDetectionStrategy} from 'angular2/core';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

import {PlaylistMenuComponent} from "../../component/playlist-menu/playlist-menu.component";
import {PlaylistCollection} from "../../model/playlist-collection";

@Component({
  selector: 'main-layout',
  template: require('./main-layout.html'),
  styles: [require('./main-layout.scss')],
  directives: [PlaylistMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayout {

  private playlistCollection:Observable<PlaylistCollection>;

  constructor( store:Store<PlaylistCollection> ) {

    this.playlistCollection = store.select('playlistsCollection');
    this.playlistCollection.subscribe(data => console.log('MainLayout.playlistCollection: data:', data));   // debug!

  }
}
