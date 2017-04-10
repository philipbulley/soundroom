import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from '../../shared/model/playlist';
import { PlaylistTrack } from '../../shared/model/playlist-track';
import { PlaylistCollection } from '../../shared/model/playlist-collection';

@Component({
  selector: 'sr-now-playing-preview',
  template: require('./now-playing-preview.component.html'),
  styles: [require('./now-playing-preview.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlayingPreviewComponent implements OnInit {

  // tslint:disable-next-line:no-unused-variable
  @Input() private playlistCollection: PlaylistCollection;

  private playlist: Playlist;
  private playlistTrack: PlaylistTrack;
  // private progress$:Observable<number>;

  constructor(private cdr: ChangeDetectorRef, private router: Router) {

  }

  ngOnInit(): any {
    this.playlistTrack = this.playlist
      ? this.playlist.current
      : null;
  }
}
