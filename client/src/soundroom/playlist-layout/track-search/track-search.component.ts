import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Playlist } from '../../shared/model/playlist';

@Component({
  selector: 'sr-track-search',
  template: require('./track-search.html'),
  styles: [require('./track-search.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackSearchComponent {
  @Input() playlist: Playlist;
}
