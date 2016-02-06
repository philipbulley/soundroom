import {Component, Input} from 'angular2/core';

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

  constructor( private playlistService:PlaylistService ) {

  }

  deleteMe() {
    console.log('PlaylistMenuComponent.deleteMe()', this.playlist);

    this.isDeleting = true;

    return this.playlistService.deletePlaylist(this.playlist)
      .subscribe(( success ) => {
          // success should really always be true, otherwise we should have errored
          //console.log('PlaylistMenuComponent.deletePlaylist() subscribe: removing', playlist);
          //this.playlists.splice(this.playlists.indexOf(playlist), 1);
          console.log('PlaylistMenuItemComponent.deletePlaylist() subscribe: success', success);
        },
        error => {
          // TODO: Handle error message in UI
          this.isDeleting = false;
          this.errorMessage = <any>error;
        });

  }
}
