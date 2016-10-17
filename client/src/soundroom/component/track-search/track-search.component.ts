import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";

@Component({
  selector: 'track-search',
  template: require('./track-search.html'),
  styles: [require('./track-search.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackSearchComponent implements OnInit {

  @Input('playlist')
  observablePlaylist:Observable<Playlist>;

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
