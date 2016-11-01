import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../shared/model/playlist";
import {PlaylistService} from "../../shared/service/playlist.service";

@Component({
  selector: 'sr-track-search',
  template: require('./track-search.html'),
  styles: [require('./track-search.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackSearchComponent implements OnInit {

  // TODO: No need to be observable
  @Input('playlist') observablePlaylist:Observable<Playlist>;

  private playlist:Playlist;

  constructor( private cdr:ChangeDetectorRef, private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    // console.log('TrackSearch.ngOnInit()', this.observablePlaylist);

    this.observablePlaylist.subscribe(( playlist:Playlist ) => {
      // console.log('TrackSearch: observablePlaylist.subscribe()', playlist);
      this.playlist = playlist;

      this.cdr.markForCheck();
    });
  }


}
