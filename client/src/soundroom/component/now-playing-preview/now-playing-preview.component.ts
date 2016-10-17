import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {Playlist} from "../../model/playlist";
import {ArtistsNamesPipe} from "../../pipe/artists-names.pipe";
import {PlaylistTrack} from "../../model/playlist-track";
import {PlaylistCollection} from "../../model/playlist-collection";

@Component({
  selector: 'now-playing-preview',
  template: require('./now-playing-preview.html'),
  styles: [require('./now-playing-preview.scss')],
  directives: [ROUTER_DIRECTIVES],
  pipes: [ArtistsNamesPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPlayingPreviewComponent implements OnInit {

  // tslint:disable-next-line:no-unused-variable
  @Input() private playlistCollection:PlaylistCollection;

  private playlist:Playlist;
  private playlistTrack:PlaylistTrack;
  // private progress$:Observable<number>;

  constructor( private cdr:ChangeDetectorRef, private router:Router ) {

  }

  ngOnInit():any {
    this.playlistTrack = this.playlist
      ? this.playlist.current
      : null;
  }

  joinRoom() {
    // TODO: Use [routerLink]="['playlist', playlist._id]" when https://github.com/angular/angular/issues/9471 fixed
    // console.log('PlaylistMenuItemComponent.joinRoom():', ['playlist', this.playlist._id]);
    this.router.navigate(['playlist', this.playlistCollection.active._id]);
  }
}
