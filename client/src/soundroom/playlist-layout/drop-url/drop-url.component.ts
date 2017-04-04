import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import {Store, Action} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import 'rxjs/add/observable/merge';
import {PlaylistService} from "../../shared/service/playlist.service.ts";
import {Playlist} from "../../shared/model/playlist";
import {ProviderEnum} from "../../shared/model/enum/provider.enum.ts";
import {SpotifyService} from "../../shared/service/spotify.service.ts";
import {PlaylistError} from "../../shared/model/error/playlist-error";
import {AddTrackAction} from '../../shared/store/playlist-collection/add-track/add-track.action';
import {AppState} from '../../shared/model/app-state';
import {PlaylistCollection} from '../../shared/model/playlist-collection';
import {PlaylistTrack} from '../../shared/model/playlist-track';
import {AddTrackErrorAction} from '../../shared/store/playlist-collection/add-track-error/add-track-error.action';
import {TrackAddedAction} from '../../shared/store/playlist-collection/track-upsert/track-added.action';
const alertify = require('alertify.js');

// Change to Component and transclude drop-url-overlay
@Component({
  selector: 'sr-drop-url',
  template: require('./drop-url.html'),
  styles: [require('./drop-url.scss')],
  host: {
    '(drop)': 'handleDrop($event)',
    '(dragover)': 'handleDragOver($event)',
    '(dragend)': 'handleDragEnd($event)',
    '(dragleave)': 'handleDragLeave($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropUrlComponent implements OnInit, OnDestroy {

  @Input() playlist: Playlist;

  private CSS_CLASS: string = 'drop-url';
  private CSS_CLASS_ACTIVE: string = 'is-active';
  private CSS_CLASS_ACCEPTED: string = 'is-accepted';
  private CSS_CLASS_REJECTED: string = 'is-rejected';

  private isDrag: boolean = false;
  private playlistTrackAddedResult: Subscription;

  constructor(private el: ElementRef,
              private store$: Store<AppState>,
              private playlistService: PlaylistService,
              private spotifyService: SpotifyService) {
    // console.log('DropUrlComponent()');
  }

  ngOnInit() {
    this.el.nativeElement.classList.add(this.CSS_CLASS);
  }

  ngOnDestroy() {
    if (this.playlistTrackAddedResult) {
      this.playlistTrackAddedResult.unsubscribe();
    }
  }

  handleDragOver(event) {
    // console.log('DropUrlComponent.handleDragOver()', event.dataTransfer);
    event.preventDefault();

    if (this.isDrag) {
      return;
    }

    this.isDrag = true;
    this.el.nativeElement.classList.add(this.CSS_CLASS_ACTIVE);
  }

  handleDrop(event) {
    // console.log('DropUrlComponent.handleDrop()', event, event.dataTransfer.getData("URL"));
    event.preventDefault();

    this.isDrag = false;

    const url = event.dataTransfer.getData("URL");

    const isValid = this.spotifyService.isValidSpotifyUrl(url);

    const validatorClass = isValid
      ? this.CSS_CLASS_ACCEPTED
      : this.CSS_CLASS_REJECTED;

    this.el.nativeElement.classList.add(validatorClass);

    if (!isValid) {
      return;
    }

    const spotifyUri = this.spotifyService.linkToSpotifyUri(url);
    console.info('DropUrlComponent.drop: ACCEPTED', spotifyUri, this.playlist);

    const playlistCollection$ = this.store$.select((store: AppState) => store.playlistCollection);

    // Wait for `TrackAddedAction` and get playlist by id.
    // NOTE: `AddTrackSuccessAction` occurs when the server tells us the track has been added (on the server)
    // `TrackAddedAction` occurs when the track data model is sent to all clients including this one, so we wait for
    // this action to determine when the `PlaylistTrack` will be in the store.
    const playlist$: Observable<Playlist> = playlistCollection$
      .filter((playlistCollection: PlaylistCollection) =>
        playlistCollection.recentAction instanceof TrackAddedAction
        && playlistCollection.recentAction.payload.playlistId === this.playlist._id
      )
      .map((playlistCollection: PlaylistCollection) =>
        playlistCollection.playlists.find((playlist: Playlist) => playlist._id === this.playlist._id))
      .distinctUntilChanged();

    // Get PlaylistTrack by foreignId
    const track$: Observable<PlaylistTrack> = playlist$.map((playlist: Playlist) =>
      playlist.tracks.find((playlistTrack: PlaylistTrack) => playlistTrack.track.foreignId === spotifyUri))
      .filter(Boolean)
      .distinctUntilChanged();

    // Wait for error
    const error$ = playlistCollection$
      .map((playlistCollection: PlaylistCollection) => playlistCollection.recentAction)
      .filter((recentAction: Action) =>
        recentAction instanceof AddTrackErrorAction && recentAction.payload.playlistId === this.playlist._id
      )
      .switchMap((action: AddTrackErrorAction) => Observable.throw(action));

    this.playlistTrackAddedResult = Observable.merge(track$, error$)
      .take(1)
      .subscribe(
        (track: PlaylistTrack) => this.handleAddTrackSuccess(track),
        (recentAction: AddTrackErrorAction) => this.handleAddTrackError(recentAction)
      );

    this.store$.dispatch(new AddTrackAction({
      playlist: this.playlist,
      provider: ProviderEnum.SPOTIFY,
      foreignId: spotifyUri,
    }));
  }

  handleDragEnd(event) {
    // console.log('DropUrlComponent.handleDragEnd()', event);
    event.preventDefault();

    this.hideOverlay();
  }

  handleDragLeave(event) {
    // console.log('DropUrlComponent.dragLeave()', event);
    event.preventDefault();

    this.hideOverlay();
  }

  handleAddTrackSuccess(track: PlaylistTrack) {
    this.hideOverlay();
  }

  handleAddTrackError(recentAction: AddTrackErrorAction) {
    switch (recentAction.payload.type) {
      case PlaylistError.PROVIDER_CONNECTION:
        alertify.error(`Sorry! The Soundroom server can't reach Spotify — your track hasn't been added.`);
        break;
      case PlaylistError.DUPLICATE_USER_UP_VOTE:
        alertify.error(`You've already up voted that track.`);
        break;
      case PlaylistError.SERVER:
        alertify.error(`Sorry! The Soundroom server is having a bad day — your track hasn't been added.`);
        break;
      case PlaylistError.UNKNOWN:
        alertify.error(`Sorry! We haven't been able to add your track.`);
        break;
    }

    this.hideOverlay();
  }

  hideOverlay() {
    this.isDrag = false;
    this.el.nativeElement.classList.remove(
      this.CSS_CLASS_ACTIVE,
      this.CSS_CLASS_ACCEPTED,
      this.CSS_CLASS_REJECTED
    );
  }
}
