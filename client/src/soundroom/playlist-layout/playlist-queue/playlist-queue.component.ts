import { Component, ChangeDetectionStrategy, Input, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Playlist } from '../../shared/model/playlist';
import { PlaylistTrack } from '../../shared/model/playlist-track';
import { PlaylistService } from '../../shared/service/playlist.service';
import { UpVote } from '../../shared/model/up-vote';
import { User } from '../../shared/model/user';
import { AppState } from '../../shared/model/app-state';
import { TrackUpVoteAction } from '../../shared/store/playlist-collection/track-up-vote/track-up-vote.action';
import { DeleteTrackAction } from "../../shared/store/playlist-collection/delete-track/delete-track.action";
import { TrackDeletedAction } from "../../shared/store/playlist-collection/track-deleted/track-deleted.action";
import { DeleteTrackErrorAction } from "../../shared/store/playlist-collection/delete-track-error/delete-track-error.action";
import { canUserDeleteTrack } from '../../shared/util/playlist.util';

const alertify = require('alertify.js');

@Component({
  selector: 'sr-playlist-queue',
  template: require('./playlist-queue.html'),
  styles: [require('./playlist-queue.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistQueueComponent implements OnDestroy, OnChanges {

  @Input() playlist: Playlist;
  @Input() user: User;

  /**
   * List of tracks in queue (not including first track ink playlist)
   */
  private playlistTracks: PlaylistTrack[];
  private playlistTrackDeletedResult: Subscription;

  constructor(private playlistService: PlaylistService, private store$: Store<AppState>) {
  }

  ngOnChanges() {
    this.playlistTracks = this.playlist.tracks.filter((playlistTrack, index) => index > 0);
  }

  ngOnDestroy(): void {
    if (this.playlistTrackDeletedResult) {
      this.playlistTrackDeletedResult.unsubscribe();
    }
  }

  upVote(playlistTrack: PlaylistTrack): void {
    this.store$.dispatch(new TrackUpVoteAction({playlist: this.playlist, playlistTrack}));
  }

  hasUserUpVote(playlistTrack: PlaylistTrack): boolean {
    return playlistTrack.upVotes.reduce((previous: boolean, upVote: UpVote) => {
      return previous || upVote.createdBy._id === this.user._id;
    }, false);
  }

  deleteTrack(playlistTrack: PlaylistTrack) {
    // confirm dialog
    const ending = Math.random() > .5
      ? `<strong>${playlistTrack.track.artists[0].name}</strong> might be offended!`
      : `<strong>${playlistTrack.track.artists[0].name}</strong> will never speak to you again!`;
    const message = `Permanently delete <strong>'${playlistTrack.track.name}'</strong> from this playlist?
      <br><br>
      ${ending}`;

    alertify.confirm(message, () => {
      // user clicked "ok"
      const playlistCollection$ = this.store$.select((store: AppState) => store.playlistCollection);
      const success$ = playlistCollection$
        .map(playlistCollection => playlistCollection.recentAction)
        .filter(recentAction => recentAction instanceof TrackDeletedAction)
        .filter((recentAction: TrackDeletedAction) => recentAction.payload.playlistTrack._id === playlistTrack._id);

      const error$ = playlistCollection$
        .map(playlistCollection => playlistCollection.recentAction)
        .filter(recentAction => recentAction instanceof DeleteTrackErrorAction)
        .filter((recentAction: DeleteTrackErrorAction) => recentAction.payload.playlistTrack._id === playlistTrack._id)
        .switchMap((recentAction: DeleteTrackErrorAction) => Observable.throw(recentAction));

      this.playlistTrackDeletedResult = Observable.merge(success$, error$)
        .take(1)
        .subscribe(
          (action: TrackDeletedAction) => this.handleDeleteTrackSuccess(action.payload.playlistTrack),
          (action: DeleteTrackErrorAction) => this.handleDeleteTrackError(action.payload.playlistTrack)
        );

      this.store$.dispatch(new DeleteTrackAction({playlist: this.playlist, playlistTrack}));
    });
  }

  canCurrentUserDeleteTrack(playlistTrack: PlaylistTrack) {
    return canUserDeleteTrack(playlistTrack, this.user);
  }

  private handleDeleteTrackSuccess(playlistTrack: PlaylistTrack) {
    const goodbyes = ['Goodbye', 'Adiós', 'Au Revoir', 'Cheerio', 'Ciao', 'So long'];
    const goodbye = goodbyes[Math.floor(Math.random() * goodbyes.length)];
    alertify.success(`${goodbye}, ${playlistTrack.track.artists[0].name}. "${playlistTrack.track.name}" is gone.`);
  }

  private handleDeleteTrackError(playlistTrack: PlaylistTrack) {
    alertify.error(`Sorry, we weren\'t able to delete "${playlistTrack.track.name}", please try again.`);
  }
}
