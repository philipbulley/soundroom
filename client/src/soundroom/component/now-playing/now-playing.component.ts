import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";

@Component({
  selector: 'now-playing',
  template: require('./now-playing.html'),
  styles: [require('./now-playing.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlayingComponent implements OnInit {

  @Input('playlist')
  playlist$:Observable<Playlist>;

  private playlist:Playlist;

  constructor(private cdr:ChangeDetectorRef) {

  }

  ngOnInit():any {
    console.log('NowPlaying.ngOnInit()', this.playlist$);

    this.playlist$.subscribe(( playlist:Playlist ) => {
      console.log('NowPlaying: playlist$.subscribe()', playlist);
      this.playlist = playlist;

      // TODO: Investigate playlist.loadState and how to show loading message within this component

      this.cdr.markForCheck();
    });
  }


}
