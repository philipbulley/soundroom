import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Playlist } from '../../shared/model/playlist';
import { PlaylistTrack } from '../../shared/model/playlist-track';
import { AppState } from '../../shared/model/app-state';
import { PlaylistPlayAction } from '../../shared/store/playlist-collection/playlist-play/playlist-play.action';
import { PlaylistPauseAction } from '../../shared/store/playlist-collection/playlist-pause/playlist-pause.action';
import { isPlaylistPlaying, getCurrentPlaylistTrack } from '../../shared/util/playlist.util';

@Component({
  selector: 'sr-now-playing',
  template: require('./now-playing.component.html'),
  styles: [require('./now-playing.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlayingComponent implements OnChanges {

  @Input() playlist: Playlist;

  private playlistTrack: PlaylistTrack;
  private progress: number;

  constructor(private store: Store<AppState>) {
    //
  }

  ngOnChanges() {
    this.playlistTrack = getCurrentPlaylistTrack(this.playlist)
      || (this.playlist.tracks && this.playlist.tracks.length
        ? this.playlist.tracks[0]
        : null);

    this.progress = this.playlistTrack
      ? this.playlistTrack.progress || 0
      : 0;
  }

  play() {
    this.store.dispatch(new PlaylistPlayAction(this.playlist));
  }

  pause() {
    this.store.dispatch(new PlaylistPauseAction(this.playlist));
  }

  togglePlay() {
    if (isPlaylistPlaying(this.playlist)) {
      this.pause();
    } else {
      this.play();
    }
  }

  isPlaying = (playlist: Playlist) => isPlaylistPlaying(playlist);
}
