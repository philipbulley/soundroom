import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { Playlist } from '../../shared/model/playlist';
import { PlaylistService } from '../../shared/service/playlist.service';
import { PlaylistTrack } from '../../shared/model/playlist-track';

@Component({
  selector: 'sr-now-playing',
  template: require('./now-playing.html'),
  styles: [require('./now-playing.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlayingComponent implements OnChanges {

  @Input() playlist: Playlist;

  private playlistTrack: PlaylistTrack;
  private progress: number;

  constructor(private playlistService: PlaylistService) {
    //
  }

  ngOnChanges() {
    this.playlistTrack = this.playlist.current
      || (this.playlist.tracks && this.playlist.tracks.length
        ? this.playlist.tracks[0]
        : null);

    this.progress = this.playlist.current
      ? this.playlist.current.progress
      : 0;
  }

  play() {
    this.playlistService.play(this.playlist._id);
  }

  pause() {
    this.playlistService.pause(this.playlist._id);
  }

  togglePlay() {
    if (this.playlist.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}
