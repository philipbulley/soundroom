import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {RouterLink} from 'angular2/router';

//import alertify from 'alertify.js';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'playlist-menu-item',
  template: require('./playlist-menu-item.html'),
  styles: [require('./playlist-menu-item.css')],
  directives: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistMenuItemComponent {

  @Input()
  private playlist:Playlist;

  private DELETE_CONFIRM_WAIT_SECS:number = 3;
  private DELETE_CONFIRM_WAIT_EXIT_SECS:number = 5;
  private errorMessage:string;
  private isDeleting:boolean = false;
  private isDeleteConfirm:boolean = false;
  private deleteWait:Observable<number>;
  private deleteWaitDisplay:Observable<number>;

  constructor( private playlistService:PlaylistService ) {

  }

  deleteMe() {
    console.log('PlaylistMenuComponent.deleteMe()', this.playlist);

    if (!this.isDeleteConfirm) {

      this.isDeleteConfirm = true;

      this.deleteWait = Observable
      // Fire initial timer value at 1ms, not 0ms. 0ms will dispatch first value synchronously, which for some reason
      // prevents AsyncPipe from updating. Not figured out why yet. Could this be a clue: http://www.bennadel.com/blog/3029-rxjs-streams-are-inconsistently-asynchronous-in-angular-2-beta-6.htm?source=epicenter
        .timer(1, 1000)
        .take(this.DELETE_CONFIRM_WAIT_SECS + this.DELETE_CONFIRM_WAIT_EXIT_SECS + 1)
        .map(secs => secs);

      // Observer for seconds before delete can be clicked
      this.deleteWaitDisplay = this.deleteWait.map((secs:number) => Math.max(0, this.DELETE_CONFIRM_WAIT_SECS - secs));

      // Observer which will exit the delete confirmation, assuming user is not wanting to delete anymore
      this.deleteWait.filter((secs:number) => secs === this.DELETE_CONFIRM_WAIT_SECS + this.DELETE_CONFIRM_WAIT_EXIT_SECS)
        .subscribe((secs:number) => this.isDeleteConfirm = false);

    } else {

      this.isDeleting = true;

      return this.playlistService.deletePlaylist(this.playlist)
        .subscribe(( success ) => {
            // success should really always be true, otherwise we should have errored
            //console.log('PlaylistMenuComponent.deletePlaylist() subscribe: removing', playlist);
            //this.playlists.splice(this.playlists.indexOf(playlist), 1);
            //alertify.success("Successfully deleted \"" + this.playlist.name + "\".");
            console.log('PlaylistMenuItemComponent.deletePlaylist() subscribe: success', success);
          },
          error => {
            //alertify.error("Can't delete \"" + this.playlist.name + "\". Try again later.");
            this.isDeleting = false;
            this.errorMessage = <any>error;
          });

    }
  }
}
