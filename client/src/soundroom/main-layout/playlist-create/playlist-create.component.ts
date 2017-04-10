import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  Renderer,
} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PlaylistCreate } from "../../shared/model/playlist-create";
import { PlaylistCreateState } from "../../shared/model/state/playlist-create.state.ts";
import { PlaylistCreateAddNameAction } from '../../shared/store/playlist-create/add-name/playlist-create-add-name.action';
import { PlaylistCreateAddDescriptionCreateAction } from '../../shared/store/playlist-create/add-description-create/playlist-create-add-description-create.action';
import { PlaylistCreateResetAction } from '../../shared/store/playlist-create/reset/playlist-create-reset.action';
import { PlaylistCreateStartAction } from '../../shared/store/playlist-create/start/playlist-create-start.action';
import { AppState } from '../../shared/model/app-state';

const alertify = require('alertify.js');

@Component({
  selector: 'sr-playlist-create',
  template: require('./playlist-create.component.html'),
  styles: [require('./playlist-create.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistCreateComponent implements OnInit, OnDestroy {
  @ViewChild('nameInput')
  nameInput: ElementRef;

  @ViewChild('descriptionInput')
  descriptionInput: ElementRef;

  @ViewChild('myInput') input: ElementRef;

  private name: string;
  private description: string;
  private playlistCreate$: Observable<PlaylistCreate>;
  private playlistCreate: PlaylistCreate;
  //private states:PlaylistCreateState;

  // tslint:disable-next-line:no-unused-variable
  private PlaylistCreateState = PlaylistCreateState;
  private playlistCreateSub: Subscription;

  constructor(private store$: Store<AppState>, private cdr: ChangeDetectorRef, private renderer: Renderer) {
    //
  }

  ngOnInit() {
    // console.log('PlaylistCreateComponent.ngOnInit()');
    this.playlistCreate$ = this.store$
      .select((state: AppState) => state.playlistCreate);

    this.playlistCreateSub = this.playlistCreate$
      .distinctUntilChanged()
      .subscribe((playlistCreate: PlaylistCreate) => this.handleStateChange(playlistCreate));
  }

  ngOnDestroy(): void {
    if (this.playlistCreateSub) {
      this.playlistCreateSub.unsubscribe();
    }
  }

  handleStateChange(data: PlaylistCreate) {
    // console.log('PlaylistCreateComponent.handleStateChange: data:', data);

    this.playlistCreate = data;

    // Update our template-bound properties with latest data from the store
    this.name = this.playlistCreate.name;
    this.description = this.playlistCreate.description;

    switch (data.state) {
      case PlaylistCreateState.ADDING_DESCRIPTION:
        // NOTE: Wait for element to show before we can focus it. Know a better way?
        setTimeout(() => this.renderer.invokeElementMethod(this.descriptionInput.nativeElement, 'focus'), 1);
        break;

      case PlaylistCreateState.SUCCESS:
        alertify.success("Created the \"" + data.playlistCreated.name + "\" room!");

        // Immediately transition to reset this component, ready for another playlist
        // TODO: Perhaps in future we open the new playlist's route instead (save for @ngrx/effects!)
        this.store$.dispatch(new PlaylistCreateResetAction());
        return;

      case PlaylistCreateState.ERROR:
        alertify.error("Can't create \"" + this.playlistCreate.name + "\". Try again later.");
        break;
    }

    this.cdr.markForCheck();
  }

  next() {
    // console.log('PlaylistCreateComponent.next()', this.playlistCreate.state);

    switch (this.playlistCreate.state) {
      case PlaylistCreateState.DEFAULT:
        this.store$.dispatch(new PlaylistCreateStartAction());
        break;

      case PlaylistCreateState.ADDING_NAME:
        if (!this.name || !this.name.length) {
          this.nameInput.nativeElement.focus();
          alertify.error("You have to give your new room a nice name!");
          return;
        }
        this.store$.dispatch(new PlaylistCreateAddNameAction(this.name));
        break;

      case PlaylistCreateState.ADDING_DESCRIPTION:
        if (!this.description) {
          this.descriptionInput.nativeElement.focus();
          return alertify.error("Tell people what your room's all about!!");
        } else if (this.description.length < 5) {
          this.descriptionInput.nativeElement.focus();
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
