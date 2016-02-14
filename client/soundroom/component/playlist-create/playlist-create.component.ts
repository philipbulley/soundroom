import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';

import * as alertify from 'alertify';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";

@Component({
  selector: 'playlist-create',
  templateUrl: 'soundroom/component/playlist-create/playlist-create.html',
  styleUrls: ['soundroom/component/playlist-create/playlist-create.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistCreateComponent {

  @Input()
  private playlist:Playlist;

  private state:string;
  private name:string;
  private description:string;

  constructor( private playlistService:PlaylistService, private cdr:ChangeDetectorRef ) {
    this.state = 'default';
  }

  validate() {
    switch (this.state) {
      case 'editStep1':
        if (!this.name || !this.name.length) {
          alertify.error("You have to give your new room a nice name!");
          return;
        }
        this.state = 'editStep2';
        break;

      case 'editStep2':
        if (!this.description || this.description.length < 3) {
          alertify.error("Tell people what your room's all about!!");
          return;
        }
        this.create();
        break;
    }
  }

  create() {
    console.log('PlaylistCreateComponent.create()', this.name);

    this.state = 'creating';

    return this.playlistService.create(this.name, this.description)
      .subscribe(( success ) => {
          // success should really always be true, otherwise we should have errored
          alertify.success("Created the \"" + this.name + "\" room!");
          console.log('PlaylistCreateComponent.create() subscribe: success', success);
          this.reset();

          // Changes made after last change detection, so inform detector that check is required
          this.cdr.markForCheck();
        },
        error => {
          alertify.error("Can't create \"" + this.name + "\". Try again later.");
          this.reset();

          // Changes made after last change detection, so inform detector that check is required
          this.cdr.markForCheck();
        });
  }

  private reset() {
    this.state = 'default';
    this.name = '';
    this.description = '';
  }
}
