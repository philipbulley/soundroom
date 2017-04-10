import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Playlist } from '../../shared/model/playlist';

@Component({
  selector: 'sr-track-search',
  template: require('./track-search.component.html'),
  styles: [require('./track-search.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackSearchComponent {
  @Input() playlist: Playlist;
}
