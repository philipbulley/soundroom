import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";
import {ArtistsNamesPipe} from "../../pipe/artists-names.pipe";
import {PlaylistTrack} from "../../model/playlist-track";
import {PlaylistService} from "../../service/playlist.service";

@Component({
  selector: 'playlist-queue',
  template: require('./playlist-queue.html'),
  styles: [require('./playlist-queue.scss')],
  pipes: [ArtistsNamesPipe],
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

  constructor( private cdr:ChangeDetectorRef, private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    this.playlist$.subscribe(( playlist:Playlist ) => {
      this.playlist = playlist;
      this.playlistTracks = playlist.tracks.filter(( playlistTrack, index ) => index > 0);

      this.cdr.markForCheck();
    });
  }

  upVote( playlistTrack:PlaylistTrack ) {
    this.playlistService.upVote(this.playlist, playlistTrack);
  }
}
