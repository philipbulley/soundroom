import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";
import {ArtistsNamesPipe} from "../../pipe/artists-names.pipe";

@Component({
  selector: 'now-playing',
  template: require('./now-playing.html'),
  styles: [require('./now-playing.scss')],
  pipes: [ArtistsNamesPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlayingComponent implements OnInit {

  @Input('playlist')
  playlist$:Observable<Playlist>;

  private playlist:Playlist;

  constructor(private cdr:ChangeDetectorRef, private playlistService:PlaylistService) {

  }

  ngOnInit():any {
    console.log('NowPlaying.ngOnInit()', this.playlist$);

    this.playlist$.subscribe(( playlist:Playlist ) => {
      console.log('NowPlaying: playlist$.subscribe()', playlist);
      this.playlist = playlist;

      this.cdr.markForCheck();
    });
  }

  play() {
    this.playlistService.play(this.playlist._id);
  }

  pause() {
    this.playlistService.pause(this.playlist._id);
  }


}
