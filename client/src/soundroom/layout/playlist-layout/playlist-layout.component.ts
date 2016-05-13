import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
var alertify = require('alertify.js');

import {PlaylistService} from "../../service/playlist.service";
import {Playlist} from "../../model/playlist";
import {PlaylistCollection} from "../../model/playlist-collection";
import {NowPlayingComponent} from "../../component/now-playing/now-playing.component";
import {TrackSearchComponent} from "../../component/track-search/track-search.component";
import {PlaylistQueueComponent} from "../../component/playlist-queue/playlist-queue.component";
import {AuthService} from "../../service/auth.service";
import {DropUrlComponent} from "../../component/drop-url/drop-url.component";

@Component({
  selector: 'playlist-layout',
  template: require('./playlist-layout.html'),
  styles: [require('./playlist-layout.scss')],
  directives: [NowPlayingComponent, TrackSearchComponent, PlaylistQueueComponent, DropUrlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistLayout implements OnInit {
  private playlist$:Observable<Playlist>;
  private playlist:Playlist;
  private noPlaylist:boolean;
  private id:string;
  private playlistCollection:Observable<PlaylistCollection>;
  private isLoading:boolean;
  private jwt:string;

  constructor( private routeParams:RouteParams, private store:Store<Playlist>, private playlistService:PlaylistService, private authService:AuthService ) {
    this.jwt = authService.jwt;
  }

  ngOnInit():any {

    console.log('PlaylistLayout.ngOnInit()');

    this.id = this.routeParams.get('id');

    this.playlistCollection = this.store.select('playlistsCollection');

    this.playlist$ = this.playlistCollection
      .map(( playlistCollection:PlaylistCollection ) => {
        // console.log('PlaylistLayout.ngOnInit: playlist: map!');
        // console.log(' - playlistCollection:', playlistCollection);
        // console.log(' - playlistCollection.playlists: ', playlistCollection.playlists);

        this.isLoading = !!playlistCollection.loadState;

        return playlistCollection.playlists
          .filter(( playlist:Playlist ) => playlist._id === this.id)[0];
      });

    // DEBUG subscribe!
    // this.playlist$
    //   .subscribe(( playlist:Playlist ) => {
    //     console.log('PlaylistLayout: playlistCollection.subscribe: data:', playlist);
    //
    //     this.playlist = playlist;
    //   });


    this.playlistService.load(this.id);
  }

}
