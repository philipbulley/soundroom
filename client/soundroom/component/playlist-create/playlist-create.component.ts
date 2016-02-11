import {Component, Input} from 'angular2/core';

import * as alertify from 'alertify';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";

@Component({
  selector: 'playlist-create',
  templateUrl: 'soundroom/component/playlist-create/playlist-create.html',
  styleUrls: ['soundroom/component/playlist-create/playlist-create.css']
})
export class PlaylistCreateComponent {

  @Input()
  private playlist:Playlist;

  private state:string;
  private name:string;
  private errorMessage:string;

  constructor( private playlistService:PlaylistService ) {
    this.state = 'default';
  }

  create() {
    console.log('PlaylistCreateComponent.create()', this.name);

    this.state = 'creating';

    if (!this.name || !this.name.length) {
      alertify.error("You have to give your new room a nice name!");
      this.state = 'default';
      return;
    }

    return this.playlistService.create(this.name)
      .subscribe(( success ) => {
          // success should really always be true, otherwise we should have errored
          alertify.success("Created the \"" + this.name + "\" room!");
          console.log('PlaylistCreateComponent.create() subscribe: success', success);
          this.reset();
        },
        error => {
          alertify.error("Can't create \"" + this.name + "\". Try again later.");
          this.reset();
          this.errorMessage = <any>error;
        });
  }

  private reset() {
    this.state = 'default';
    this.name = '';
  }
}
