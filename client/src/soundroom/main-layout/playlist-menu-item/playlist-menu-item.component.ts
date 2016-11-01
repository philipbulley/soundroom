import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from '../../shared/model/playlist';
import { PlaylistService } from '../../shared/service/playlist.service';
import { Observable } from 'rxjs/Observable';

var alertify = require('alertify.js');

@Component({
  selector: 'sr-playlist-menu-item',
  template: require('./playlist-menu-item.html'),
  styles: [require('./playlist-menu-item.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistMenuItemComponent {

  @Input()
  private playlist: Playlist;

  /** To prevent trigger happy clicking, button will be disabled for this length of time before allowing input */
  private DELETE_CONFIRM_DISABLED_SECS: number = 3;

  /** Button will allow a click to execute delete for this length of time following the disabled period */
  private DELETE_CONFIRM_ENABLED_SECS: number = 2;

  /** A delete network request is in progress */
  private DELETE_STATE_NETWORK = 'DELETE_STATE_NETWORK';

  /** The full delete button is visible, but is not yet clickable */
  private DELETE_STATE_CONFIRM_DISABLED = 'DELETE_STATE_CONFIRM_DISABLED';

  /** The delete button can be clicked, doing so will execute a delete */
  private DELETE_STATE_CONFIRM_ENABLED = 'DELETE_STATE_CONFIRM_ENABLED';

  /** Holds the value of a `DELETE_STATE_*` constant */
  private deleteState = null;

  /** Observable that produces a counter based on the DELETE_CONFIRM_* constants */
  private deleteConfirm: Observable<number>;

  /** Number of seconds remaining until delete button becomes enabled */
  private deleteDisabledSecs: number;


  constructor(private playlistService: PlaylistService, private cdr: ChangeDetectorRef, private router: Router) {
    // console.log('PlaylistMenuItemComponent()', router);
  }

  deleteMe() {
    // console.log('PlaylistMenuItemComponent.deleteMe()', this.playlist);

    if (!this.deleteState) {

      this.deleteState = this.DELETE_STATE_CONFIRM_DISABLED;

      // The `deleteConfirm` Observable is no longer used with AsyncPipe in the template, as it was causing an error to
      // be thrown when changing route in angular 2.0.0-beta.11
      this.deleteConfirm = Observable
      // Fire initial timer value at 1ms, not 0ms. 0ms will dispatch first value synchronously, which for some reason
      // prevents AsyncPipe from updating. Not figured out why yet. Could this be a clue:
      // http://www.bennadel.com/blog/3029-rxjs-streams-are-inconsistently-asynchronous-in-angular-2-beta-6.htm?source=epicenter
        .timer(1, 1000)
        .take(this.DELETE_CONFIRM_DISABLED_SECS + this.DELETE_CONFIRM_ENABLED_SECS + 1)
        .map(secs => secs);

      // Observer for seconds before delete can be clicked
      this.deleteConfirm
        .map((secs: number) => Math.max(0, this.DELETE_CONFIRM_DISABLED_SECS - secs))
        .subscribe(secs => {
          this.deleteDisabledSecs = secs;

          if (secs === 0) {
            this.deleteState = this.DELETE_STATE_CONFIRM_ENABLED;
          }

          this.cdr.markForCheck();
        });

      // Observer which will exit the delete confirmation, assuming user is not wanting to delete anymore
      this.deleteConfirm
        .subscribe((secs: number) => {
          if (secs === this.DELETE_CONFIRM_DISABLED_SECS + this.DELETE_CONFIRM_ENABLED_SECS) {
            this.deleteState = null;
          }
          this.cdr.markForCheck();
        });

    } else {

      this.deleteState = this.DELETE_STATE_NETWORK;

      return this.playlistService.deletePlaylist(this.playlist)
        .subscribe((success) => {
            // success should really always be true, otherwise we should have errored
            //console.log('PlaylistMenuComponent.deletePlaylist() subscribe: removing', playlist);
            //this.playlists.splice(this.playlists.indexOf(playlist), 1);
            alertify.success("Successfully deleted \"" + this.playlist.name + "\".");
            // console.log('PlaylistMenuItemComponent.deletePlaylist() subscribe: success', success);
          },
          error => {
            alertify.error("Can't delete \"" + this.playlist.name + "\". Try again later.");
            this.deleteState = null;
          });
    }
  }
}
