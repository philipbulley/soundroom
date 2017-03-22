import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from '../../shared/model/playlist';
import { PlaylistService } from '../../shared/service/playlist.service';
import { Observable } from 'rxjs/Observable';
import { DeletePlaylistAction } from '../../shared/store/playlist-collection/delete-playlist/delete-playlist.action';
import { Store, Action } from '@ngrx/store';
import { AppState } from '../../shared/model/app-state';
import { PlaylistCollection } from '../../shared/model/playlist-collection';
import { DeletePlaylistErrorAction } from '../../shared/store/playlist-collection/delete-playlist-error/delete-playlist-error.action';
import { DeletePlaylistSuccessAction } from '../../shared/store/playlist-collection/delete-playlist-success/delete-playlist-success.action';
import { Subscription } from 'rxjs';

const alertify = require('alertify.js');

@Component({
  selector: 'sr-playlist-menu-item',
  template: require('./playlist-menu-item.html'),
  styles: [require('./playlist-menu-item.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistMenuItemComponent implements OnDestroy {

  DeleteState = DeleteState;

  @Input()
  private playlist: Playlist;

  /** To prevent trigger happy clicking, button will be disabled for this length of time before allowing input */
  private DELETE_CONFIRM_DISABLED_SECS: number = 3;

  /** Button will allow a click to execute delete for this length of time following the disabled period */
  private DELETE_CONFIRM_ENABLED_SECS: number = 2;

  /** Holds the internal state of deletion */
  private _deleteState: DeleteState = DeleteState.INACTIVE;

  /** Observable that produces a counter based on the DELETE_CONFIRM_* constants */
  private deleteConfirm$: Observable<number>;

  /** Number of seconds remaining until delete button becomes enabled */
  private deleteDisabledSecs: number;
  private successOrError: Subscription;
  private deleteConfirmClickable: Subscription;
  private deleteConfirmCancel: Subscription;

  constructor(private store$: Store<AppState>,
              private playlistService: PlaylistService,
              private cdr: ChangeDetectorRef,
              private router: Router) {
    // console.log('PlaylistMenuItemComponent()', router);
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }

  deleteMe() {
    // console.log('PlaylistMenuItemComponent.deleteMe()', this.playlist);
    this.deleteState
      ? this.dispatchDelete()
      : this.initDeleteConfirm();
  }

  set deleteState(state: DeleteState) {
    this._deleteState = state;
    if (DeleteState.INACTIVE === state) {
      this.cleanUp();
    }
    this.cdr.markForCheck();
  }

  get deleteState(): DeleteState {
    return this._deleteState;
  }

  private dispatchDelete() {
    this.deleteState = DeleteState.NETWORK;

    const playlistCollection$ = this.store$.select((state: AppState) => state.playlistCollection);

    // Wait for delete success or error
    this.successOrError = playlistCollection$
      .map((playlistCollection: PlaylistCollection) => playlistCollection.recentAction)
      .filter((recentAction: Action) =>
        (recentAction instanceof DeletePlaylistSuccessAction
        || recentAction instanceof DeletePlaylistErrorAction)
        && recentAction.payload === this.playlist
      )
      .take(1)
      .subscribe((recentAction: DeletePlaylistSuccessAction | DeletePlaylistErrorAction) => {
        if (recentAction instanceof DeletePlaylistSuccessAction) {
          alertify.success(`Successfully deleted "${this.playlist.name}".`);
        } else if (recentAction instanceof DeletePlaylistErrorAction) {
          alertify.error(`Can't delete "${this.playlist.name}". Try again later.`);
        }
        this.deleteState = DeleteState.INACTIVE;
      });

    this.store$.dispatch(new DeletePlaylistAction(this.playlist));
  }

  private initDeleteConfirm() {
    this.deleteState = DeleteState.CONFIRM_DISABLED;

    // The `deleteConfirmClickable` Observable is no longer used with AsyncPipe in the template, as it was causing an
    // error to be thrown when changing route in angular 2.0.0-beta.11
    this.deleteConfirm$ = Observable
    // Fire initial timer value at 1ms, not 0ms. 0ms will dispatch first value synchronously, which for some reason
    // prevents AsyncPipe from updating. Not figured out why yet. Could this be a clue:
    // http://www.bennadel.com/blog/3029-rxjs-streams-are-inconsistently-asynchronous-in-angular-2-beta-6.htm?source=epicenter
      .timer(1, 1000)
      .take(this.DELETE_CONFIRM_DISABLED_SECS + this.DELETE_CONFIRM_ENABLED_SECS + 1)
      .map(secs => secs);

    // Observable for seconds before delete can be clicked
    this.deleteConfirmClickable = this.deleteConfirm$
      .map((secs: number) => Math.max(0, this.DELETE_CONFIRM_DISABLED_SECS - secs))
      .map((secs: number) => {
        this.deleteDisabledSecs = secs;
        this.cdr.markForCheck();
        return secs;
      })
      .filter((secs: number) => secs === 0)
      .subscribe(secs => this.deleteState = DeleteState.CONFIRM_ENABLED);

    // Observable which will exit the delete confirmation, assuming user is not wanting to delete anymore
    this.deleteConfirmCancel = this.deleteConfirm$
      .filter((secs: number) => secs === this.DELETE_CONFIRM_DISABLED_SECS + this.DELETE_CONFIRM_ENABLED_SECS)
      .subscribe((secs: number) => this.deleteState = DeleteState.INACTIVE);
  }

  private cleanUp() {
    if (this.successOrError) {
      this.successOrError.unsubscribe();
    }

    if (this.deleteConfirmClickable) {
      this.deleteConfirmClickable.unsubscribe();
    }

    if (this.deleteConfirmCancel) {
      this.deleteConfirmCancel.unsubscribe();
    }
  }
}

enum DeleteState {
  INACTIVE,

    /** The full delete button is visible, but is not yet clickable */
  CONFIRM_DISABLED,

    /** The delete button can be clicked, doing so will execute a delete */
  CONFIRM_ENABLED,

    /** A delete network request is in progress */
  NETWORK,
}
