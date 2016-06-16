import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";
import {ArtistsNamesPipe} from "../../pipe/artists-names.pipe";
import {PlaylistTrack} from "../../model/playlist-track";
import {PlaylistService} from "../../service/playlist.service";
import {UpVoteAvatarsComponent} from "../up-vote-avatars/up-vote-avatars.component";
import {UpVote} from "../../model/up-vote";
import {Auth} from "../../model/auth";
import {Store} from '@ngrx/store';
import {AuthState} from "../../model/state/auth.state";

@Component({
  selector: 'playlist-queue',
  template: require('./playlist-queue.html'),
  styles: [require('./playlist-queue.scss')],
  pipes: [ArtistsNamesPipe],
  directives: [UpVoteAvatarsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistQueueComponent implements OnInit {

  @Input('playlist')
  playlist$:Observable<Playlist>;

  /**
   * List of tracks in queue (not including first track ink playlist)
   */
  private playlistTracks:PlaylistTrack[];

  private playlist:Playlist;

  private auth$:Observable<Auth>;
  private auth:Auth;

  private isLoggedIn:boolean = false;

  constructor( private cdr:ChangeDetectorRef, private playlistService:PlaylistService, private authStore:Store<Auth> ) {
    this.auth$ = this.authStore.select('auth');
  }

  ngOnInit():any {
    this.playlist$.subscribe(( playlist:Playlist ) => {
      this.playlist = playlist;
      this.playlistTracks = playlist.tracks.filter(( playlistTrack, index ) => index > 0);

      console.log('PlaylistQueueComponent.ngOnInit:', playlist);

      this.cdr.markForCheck();
    });


    this.auth$.subscribe(( auth:Auth ) => {
      this.auth = auth;
      this.isLoggedIn = this.auth.state === AuthState.LOGGED_IN;
      this.cdr.markForCheck();
    });
  }

  upVote( playlistTrack:PlaylistTrack ):void {
    this.playlistService.upVote(this.playlist, playlistTrack);
  }

  hasUserUpVote( playlistTrack:PlaylistTrack ):boolean {
    console.log('PlaylistQueueComponent.hasUserUpVote(): auth:', this.auth.user);

    return playlistTrack.upVotes.reduce(( previous:boolean, upVote:UpVote ) => {
      return previous || upVote.createdBy._id === this.auth.user._id
    }, false);
  }
}
