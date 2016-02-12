import {Component, Input} from 'angular2/core';
import {Router} from 'angular2/router';

import * as alertify from 'alertify';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";

@Component({
  selector: 'playlist-menu-item',
  templateUrl: 'soundroom/component/playlist-menu-item/playlist-menu-item.html',
  styleUrls: ['soundroom/component/playlist-menu-item/playlist-menu-item.css']
})
export class PlaylistMenuItemComponent {

  @Input()
  private playlist:Playlist;

  private errorMessage:string;
  private isDeleting:boolean = false;

  constructor( private playlistService:PlaylistService, private router:Router ) {

  }

  join() {
    this.router.navigate([`PlaylistLayout`, {id: this.playlist._id}]);
  }

  deleteMe() {
    console.log('PlaylistMenuComponent.deleteMe()', this.playlist);

    this.isDeleting = true;

    return this.playlistService.deletePlaylist(this.playlist)
      .subscribe(( success ) => {
          // success should really always be true, otherwise we should have errored
          //console.log('PlaylistMenuComponent.deletePlaylist() subscribe: removing', playlist);
          //this.playlists.splice(this.playlists.indexOf(playlist), 1);
          alertify.success("Successfully deleted \"" + this.playlist.name + "\".");
          console.log('PlaylistMenuItemComponent.deletePlaylist() subscribe: success', success);
        },
        error => {
          alertify.error("Can't delete \"" + this.playlist.name + "\". Try again later.");
          this.isDeleting = false;
          this.errorMessage = <any>error;
        });

  }
}
