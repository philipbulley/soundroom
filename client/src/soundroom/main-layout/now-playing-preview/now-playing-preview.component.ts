import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { Playlist } from '../../shared/model/playlist';
import { PlaylistTrack } from '../../shared/model/playlist-track';
import { PlaylistCollection } from '../../shared/model/playlist-collection';
import { getCurrentPlaylistTrack } from '../../shared/util/playlist.util';

@Component({
  selector: 'sr-now-playing-preview',
  template: require('./now-playing-preview.component.html'),
  styles: [require('./now-playing-preview.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlayingPreviewComponent implements OnChanges {

  // tslint:disable-next-line:no-unused-variable
  @Input()
  private playlistCollection: PlaylistCollection;

  private playlist: Playlist;
  private playlistTrack: PlaylistTrack;

  constructor() {
    //
  }

  ngOnChanges(): any {
    if (!this.playlistCollection.active) {
      return;
    }

    this.playlist = this.playlistCollection.active;

    this.playlistTrack = this.playlist
      ? getCurrentPlaylistTrack(this.playlist)
      : null;
  }
}
