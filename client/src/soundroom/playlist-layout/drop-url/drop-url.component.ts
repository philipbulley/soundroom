import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PlaylistService } from "../../shared/service/playlist.service.ts";
import { Playlist } from "../../shared/model/playlist";
import { ProviderEnum } from "../../shared/model/enum/provider.enum.ts";
import { SpotifyService } from "../../shared/service/spotify.service.ts";
import { PlaylistError } from "../../shared/model/error/playlist-error";
import { AddTrackAction } from '../../shared/store/playlist-collection/add-track/add-track.action';
import { AppState } from '../../shared/model/app-state';
import { PlaylistCollection } from '../../shared/model/playlist-collection';
import { PlaylistTrack } from '../../shared/model/playlist-track';
import { AddTrackErrorAction } from '../../shared/store/playlist-collection/add-track-error/add-track-error.action';
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
  private playlistTrackAddedSuccess: Subscription;
  private playlistTrackAddedError: Subscription;

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
    if (this.playlistTrackAddedSuccess) {
      this.playlistTrackAddedError.unsubscribe();
    }

    if (this.playlistTrackAddedError) {
      this.playlistTrackAddedError.unsubscribe();
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

    // Get playlist by id
    const playlist$: Observable<Playlist> = playlistCollection$.map((playlistCollection: PlaylistCollection) =>
      playlistCollection.playlists.find((playlist: Playlist) => playlist._id === this.playlist._id))
      .distinctUntilChanged();

    // Get PlaylistTrack by foreignId
    const track$: Observable<PlaylistTrack> = playlist$.map((playlist: Playlist) =>
      playlist.tracks.find((playlistTrack: PlaylistTrack) => playlistTrack.track.foreignId === spotifyUri))
      .distinctUntilChanged();

    // Wait for success
    this.playlistTrackAddedSuccess = track$
      .filter(Boolean)
      .take(1)
      .subscribe(() => {
        console.log('DropUrlComponent.subscribe(): status:', status);
        this.hideOverlay();
      });

    // Wait for error
    this.playlistTrackAddedError = playlistCollection$
      .map((playlistCollection: PlaylistCollection) => playlistCollection.recentAction)
      .filter((recentAction: Action) =>
        recentAction instanceof AddTrackErrorAction && recentAction.payload.playlistId === this.playlist._id
      )
      .take(1)
      .subscribe((recentAction: AddTrackErrorAction) => {
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
      });

    this.store$.dispatch(new AddTrackAction({
      playlist: this.playlist,
      provider: ProviderEnum.SPOTIFY,
      foreignId: spotifyUri
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

  hideOverlay() {
    this.isDrag = false;
    this.el.nativeElement.classList.remove(
      this.CSS_CLASS_ACTIVE,
      this.CSS_CLASS_ACCEPTED,
      this.CSS_CLASS_REJECTED
    );
  }


}
