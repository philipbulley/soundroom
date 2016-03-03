import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef} from 'angular2/core';

import * as alertify from 'alertify';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";
import {PlaylistCreate} from "../../model/playlist-create";
import {PlaylistCreateAction} from "../../model/enum/playlist-create-action";
import {PlaylistState} from "../../model/enum/playlist-state";
import {PlaylistCreateState} from "../../model/enum/playlist-create-state";

@Component({
  selector: 'playlist-create',
  templateUrl: 'soundroom/component/playlist-create/playlist-create.html',
  styleUrls: ['soundroom/component/playlist-create/playlist-create.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistCreateComponent {

  private name:string;
  private description:string;
  private playlistCreate$:Observable<PlaylistCreate>;
  private playlistCreate:PlaylistCreate;
  private cdr:ChangeDetectorRef;
  //private states:PlaylistCreateState;

  constructor( private store:Store, private cdr:ChangeDetectorRef ) {

    this.playlistCreate$ = this.store.select('playlistCreate');
    console.log('PlaylistCreateComponent()');

    this.playlistCreate$.subscribe(( data:PlaylistCreate ) => {
      console.log('PlaylistCreateComponent.playlistCreate$: data:', data);

      // Infer successful creation when state transitions from CREATING back to DEFAULT (there is no success state)
      if (this.playlistCreate && this.playlistCreate.state === PlaylistCreateState.CREATING && data.state === PlaylistCreateState.DEFAULT) {
        alertify.success("Created the \"" + this.playlistCreate.playlist.name + "\" room!");
        this.reset();
      }

      this.playlistCreate = data;

      this.cdr.markForCheck();
    });

    // Show notification for error
    this.playlistCreate$.filter(( data:PlaylistCreate ) => data.state === PlaylistCreateState.ERROR)
      .subscribe(( error:any ) => alertify.error("Can't create \"" + this.playlistCreate.playlist.name + "\". Try again later."))

  }

  next() {
    console.log('PlaylistCreateComponent.next()', this.playlistCreate.state);

    switch (this.playlistCreate.state) {

      case PlaylistCreateState.DEFAULT:
        this.store.dispatch({type: PlaylistCreateAction.START});
        break;

      case PlaylistCreateState.ADDING_NAME:
        console.log('PlaylistCreateComponent.next: a');
        if (!this.name || !this.name.length) {
          alertify.error("You have to give your new room a nice name!");
          return;
        }
        this.store.dispatch({type: PlaylistCreateAction.ADD_NAME, payload: this.name});
        break;

      case PlaylistCreateState.ADDING_DESCRIPTION:
        console.log('PlaylistCreateComponent.next: b');
        if (!this.description || this.description.length < 3) {
          alertify.error("Tell people what your room's all about!!");
          return;
        }
        this.store.dispatch({type: PlaylistCreateAction.ADD_DESCRIPTION, payload: this.description});
        this.create();
        break;

    }
  }

  create() {
    console.log('PlaylistCreateComponent.create()', this.name);

    this.store.dispatch({type: PlaylistCreateAction.CREATE});
  }

  getButtonLabel( state:PlaylistCreateState ) {
    switch (state) {
      case PlaylistCreateState.ADDING_NAME:
        return 'Next';
      case PlaylistCreateState.ADDING_DESCRIPTION:
        return 'Create!';
    }
  }

  private reset() {
    this.name = '';
    this.description = '';
  }
}
