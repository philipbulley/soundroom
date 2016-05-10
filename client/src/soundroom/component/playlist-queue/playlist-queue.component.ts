import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef} from 'angular2/core';

import {Observable} from 'rxjs/Observable';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";
import {ArtistsNamesPipe} from "../../pipe/artists-names.pipe";

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

  private playlist:Playlist;

  constructor( private cdr:ChangeDetectorRef, private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    console.log('PlaylistQueue.ngOnInit()', this.playlist$);

    // this.playlist$.subscribe(( playlist:Playlist ) => {
    //   console.log('PlaylistQueue: playlist$.subscribe()', playlist);
    //   this.playlist = playlist;
    //
    //   this.cdr.markForCheck();
    // });
  }


}
