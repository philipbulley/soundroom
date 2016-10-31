import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { PlaylistCreate } from "../../shared/model/playlist-create";
import { PlaylistCreateState } from "../../shared/model/state/playlist-create.state.ts";
import { PlaylistCreateAddNameAction } from '../../shared/store/playlist-create/add-name/playlist-create-add-name.action';
import { PlaylistCreateAddDescriptionCreateAction } from '../../shared/store/playlist-create/add-description-create/playlist-create-add-description-create.action';
import { PlaylistCreateResetAction } from '../../shared/store/playlist-create/reset/playlist-create-reset.action';
import { PlaylistCreateStartAction } from '../../shared/store/playlist-create/start/playlist-create-start.action';
import { AppState } from '../../shared/model/app-state';

var alertify = require('alertify.js');

@Component({
  selector: 'playlist-create',
  template: require('./playlist-create.html'),
  styles: [require('./playlist-create.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistCreateComponent implements OnInit {

  @ViewChild('nameEl')
  nameEl: ElementRef;

  @ViewChild('descriptionEl')
  descriptionEl: ElementRef;

  private name: string;
  private description: string;
  private playlistCreate$: Observable<PlaylistCreate>;
  private playlistCreate: PlaylistCreate;
  //private states:PlaylistCreateState;

  // tslint:disable-next-line:no-unused-variable
  private PlaylistCreateState = PlaylistCreateState;

  constructor(private store$: Store<AppState>, private cdr: ChangeDetectorRef) {
    //
  }

  ngOnInit() {
    // console.log('PlaylistCreateComponent()');
    this.playlistCreate$ = this.store$.map((state: AppState) => state.playlistCreate);

    //this.states = PlaylistCreateState;

    this.playlistCreate$.subscribe((data: PlaylistCreate) => {
      // console.log('PlaylistCreateComponent.playlistCreate$: data:', data);

      // The immutible store
      this.playlistCreate = data;

      // Update our template-bound properties with latest data from the store
      this.name = this.playlistCreate.name;
      this.description = this.playlistCreate.description;

      switch (data.state) {
        case PlaylistCreateState.ADDING_DESCRIPTION:
          // NOTE: Wait for element to show before we can focus it. Know a better way?
          setTimeout(() => this.descriptionEl.nativeElement.focus(), 1);
          break;

        case PlaylistCreateState.SUCCESS:
          alertify.success("Created the \"" + data.playlistCreated.name + "\" room!");

          // Immediately transition to reset this component, ready for another playlist
          // TODO: Perhaps in future we open the new playlist's route instead
          this.store$.dispatch(new PlaylistCreateResetAction());
          return;

        case PlaylistCreateState.ERROR:
          alertify.error("Can't create \"" + this.playlistCreate.name + "\". Try again later.");
          break;
      }

      // As our store Observable is via DI, ChangeDetectionStrategy.OnPush won't notice changes. Tell it to check.
      //cdr.markForCheck();   // Calling synchronously causes error within markForCheck(). PlaylistCreate can't return
      // to default as a result on success.
      setTimeout(() => this.cdr.markForCheck(), 1); // Until the above is fixed (issue with angular2 2.0.0-beta.8),
                                                    // setTimeout fixes by calling asynchronously
    });
  }

  next() {
    // console.log('PlaylistCreateComponent.next()', this.playlistCreate.state);

    switch (this.playlistCreate.state) {

      case PlaylistCreateState.DEFAULT:
        this.store$.dispatch(new PlaylistCreateStartAction());
        break;

      case PlaylistCreateState.ADDING_NAME:
        if (!this.name || !this.name.length) {
          this.nameEl.nativeElement.focus();
          alertify.error("You have to give your new room a nice name!");
          return;
        }
        this.store$.dispatch(new PlaylistCreateAddNameAction(this.name));
        break;

      case PlaylistCreateState.ADDING_DESCRIPTION:
        if (!this.description) {
          this.descriptionEl.nativeElement.focus();
          return alertify.error("Tell people what your room's all about!!");
        } else if (this.description.length < 5) {
          this.descriptionEl.nativeElement.focus();
          return alertify.error("Surely you can come up with a better description than that!");
        }
        this.store$.dispatch(new PlaylistCreateAddDescriptionCreateAction(this.description));
        break;
    }
  }

  close() {
    this.store$.dispatch(new PlaylistCreateResetAction());
  }

  getButtonLabel(state: PlaylistCreateState) {
    switch (state) {
      case PlaylistCreateState.ADDING_NAME:
        return 'Next';
      case PlaylistCreateState.ADDING_DESCRIPTION:
        return 'Create!';
    }
  }
}
