import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";

@Component({
  selector: 'track-search',
  template: require('./track-search.html'),
  styles: [require('./track-search.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackSearchComponent implements OnInit {

  @Input('playlist')
  playlist$:Observable<Playlist>;

  private playlist:Playlist;

  constructor( private cdr:ChangeDetectorRef, private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    console.log('TrackSearch.ngOnInit()', this.playlist$);

    this.playlist$.subscribe(( playlist:Playlist ) => {
      // console.log('TrackSearch: playlist$.subscribe()', playlist);
      this.playlist = playlist;

      this.cdr.markForCheck();
    });
  }


}
