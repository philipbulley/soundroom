import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from '@angular/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../shared/model/playlist";
import {ArtistsNamesPipe} from "../../shared/pipe/artists-names.pipe";
import {PlaylistTrack} from "../../shared/model/playlist-track";
import {PlaylistService} from "../../shared/service/playlist.service";
import {UpVoteAvatarsComponent} from "../up-vote-avatars/up-vote-avatars.component";
import {UpVote} from "../../shared/model/up-vote";
import {Auth} from "../../shared/model/auth";
import {Store} from '@ngrx/store';
import {AuthState} from "../../shared/model/state/auth.state";
import {MomentPipe} from "../../shared/pipe/moment.pipe";
import {AppState} from "../../../boot";
import {User} from "../../shared/model/user";
import {PlaylistError} from "../../shared/model/error/PlaylistError";

var alertify = require('alertify.js');

@Component({
  selector: 'playlist-queue',
  template: require('./playlist-queue.html'),
  styles: [require('./playlist-queue.scss')],
  pipes: [ArtistsNamesPipe, MomentPipe],
  directives: [UpVoteAvatarsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistQueueComponent implements OnInit {

  // TODO: No need to be observable
  @Input('playlist') observablePlaylist:Observable<Playlist>;

  /**
   * List of tracks in queue (not including first track ink playlist)
   */
  private playlistTracks:PlaylistTrack[];

  private playlist:Playlist;

  private auth:Observable<Auth>;

  private isLoggedIn:boolean = false;
  private user:User;

  constructor( private cdr:ChangeDetectorRef, private playlistService:PlaylistService, private store:Store<AppState> ) {
    this.auth = <Observable<Auth>>this.store.select('auth');
  }

  ngOnInit():any {
    this.observablePlaylist.subscribe(( playlist:Playlist ) => {
      this.playlist = playlist;
      this.playlistTracks = playlist.tracks.filter(( playlistTrack, index ) => index > 0);

      // console.log('PlaylistQueueComponent.ngOnInit:', playlist);

      this.cdr.markForCheck();
    });


    this.auth.subscribe(( auth:Auth ) => {
      this.isLoggedIn = auth.state === AuthState.LOGGED_IN;
      this.user = auth.user;
      this.cdr.markForCheck();
    });
  }

  upVote( playlistTrack:PlaylistTrack ):void {
    this.playlistService.upVote(this.playlist, playlistTrack);
  }

  hasUserUpVote( playlistTrack:PlaylistTrack ):boolean {
    return playlistTrack.upVotes.reduce(( previous:boolean, upVote:UpVote ) => {
      return previous || upVote.createdBy._id === this.user._id;
    }, false);
  }

  deleteTrack( playlistTrack:PlaylistTrack ) {
    // confirm dialog
    const ending = Math.random() > .5
      ? `<strong>${playlistTrack.track.artists[0].name}</strong> might be offended!`
      : `<strong>${playlistTrack.track.artists[0].name}</strong> will never speak to you again!`;
    const message = `Permanently delete <strong>'${playlistTrack.track.name}'</strong> from this playlist?
      <br><br>
      ${ending}`;

    alertify.confirm(message, () => {
      // user clicked "ok"
      this.playlistService.deleteTrack(this.playlist, playlistTrack)
        .subscribe(( status:number ) => {
          alertify.success(`Your track has been deleted.`);
        }, ( error:PlaylistError ) => {
          console.error('PlaylistQueueComponent.deleteTrack:', error);
          alertify.error(`Sorry, we weren\'t able to delete your track, please try again.`);
        });
    });
  }

  canCurrentUserDeleteTrack( playlistTrack:PlaylistTrack ) {
    return this.playlistService.canUserDeleteTrack(playlistTrack, this.user);
  }
}
