import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef} from 'angular2/core';

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

  @ViewChild('nameEl')
  nameEl:ElementRef;

  @ViewChild('descriptionEl')
  descriptionEl:ElementRef;

  private name:string;
  private description:string;
  private playlistCreate$:Observable<PlaylistCreate>;
  private playlistCreate:PlaylistCreate;
  private cdr:ChangeDetectorRef;
  private states:PlaylistCreateState;

  constructor( private store:Store, private cdr:ChangeDetectorRef ) {

    console.log('PlaylistCreateComponent()');
    this.playlistCreate$ = this.store.select('playlistCreate');

    this.states = PlaylistCreateState;

    this.playlistCreate$.subscribe(( data:PlaylistCreate ) => {
      console.log('PlaylistCreateComponent.playlistCreate$: data:', data);

      // The immutible store
      this.playlistCreate = data;

      // Update our template-bound properties with latest data from the store
      this.name = this.playlistCreate.name;
      this.description = this.playlistCreate.description;

      switch (data.state) {
        case PlaylistCreateState.ADDING_NAME:
          // NOTE: Wait for element to show before we can focus it. Know a better way?
          setTimeout(() => this.nameEl.nativeElement.focus(), 1);
          break;

        case PlaylistCreateState.ADDING_DESCRIPTION:
          // NOTE: Wait for element to show before we can focus it. Know a better way?
          setTimeout(() => this.descriptionEl.nativeElement.focus(), 1);
          break;

        case PlaylistCreateState.SUCCESS:
          alertify.success("Created the \"" + data.playlistCreated.name + "\" room!");

          // Immediately transition to reset this component, ready for another playlist
          // TODO: Perhaps in future we open the new playlist's route instead
          this.store.dispatch({type: PlaylistCreateAction.RESET});
          return;

        case PlaylistCreateState.ERROR:
          alertify.error("Can't create \"" + this.playlistCreate.name + "\". Try again later.");
          break;
      }

      // As our store Observable is via DI, ChangeDetectionStrategy.OnPush won't notice changes. Tell it to check.
      this.cdr.markForCheck();
    });
  }

  next() {
    console.log('PlaylistCreateComponent.next()', this.playlistCreate.state);

    switch (this.playlistCreate.state) {

      case PlaylistCreateState.DEFAULT:
        this.store.dispatch({type: PlaylistCreateAction.START});
        break;

      case PlaylistCreateState.ADDING_NAME:
        if (!this.name || !this.name.length) {
          console.log('this.$name:', this.nameEl);
          this.nameEl.nativeElement.focus();
          alertify.error("You have to give your new room a nice name!");
          return;
        }
        this.store.dispatch({type: PlaylistCreateAction.ADD_NAME, payload: this.name});
        break;

      case PlaylistCreateState.ADDING_DESCRIPTION:
        if (!this.description) {
          this.descriptionEl.nativeElement.focus();
          return alertify.error("Tell people what your room's all about!!");
        } else if (this.description.length < 5) {
          this.descriptionEl.nativeElement.focus();
          return alertify.error("Surely you can come up with a better description than that!");
        }
        this.store.dispatch({type: PlaylistCreateAction.ADD_DESCRIPTION_AND_CREATE, payload: this.description});
        break;
    }
  }

  close() {
    this.store.dispatch({type: PlaylistCreateAction.RESET});
  }

  getButtonLabel( state:PlaylistCreateState ) {
    switch (state) {
      case PlaylistCreateState.ADDING_NAME:
        return 'Next';
      case PlaylistCreateState.ADDING_DESCRIPTION:
        return 'Create!';
    }
  }
}
