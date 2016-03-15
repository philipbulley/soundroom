import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
var alertify = require('alertify.js');

import {PlaylistMenuComponent} from "../../component/playlist-menu/playlist-menu.component";
import {PlaylistService} from "../../service/playlist.service";
import {Playlist} from "../../model/playlist";

@Component({
  selector: 'playlist-layout',
  template: require('./playlist-layout.html'),
  styles: [require('./playlist-layout.scss')],
  directives: [PlaylistMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistLayout implements OnInit {
  private playlist:Observable<Playlist>;
  private noPlaylist:boolean;

  constructor( private routeParams:RouteParams, private store:Store<Playlist>, private playlistService:PlaylistService ) {

  }

  ngOnInit():any {

    this.playlistService.load(
      this.routeParams.get('id')[0]
    );

    // TODO: Get playlist id from route
    // Create new playlist Store
    // Dispatch action to load all details for the specified playlist by id
    //this.playlist = this.store.select('playlist');
    //this.playlist.subscribe(data => console.log('PlaylistLayout.playlistCollection: data:', data));   // debug!

    //


    // TODO: Ask playlistService to load playist details endpoint instead of /playlists within observer creation

    //this.playlistService.playlists
    //  .map(( playlists:Playlist[] ) => {
    //    return playlists.filter(( playlist:Playlist )=> playlist._id === this.routeParams.get('id'))[0];
    //  })
    //  .subscribe(
    //    ( playlist:Playlist ) => {
    //      console.log('PlaylistLayout.ngOnInit(): subscribe:', playlist);
    //
    //      if (!playlist) {
    //        alertify.error("The Soundroom you've asked for doesn't exist");
    //        this.noPlaylist = true;
    //        return;
    //      }
    //
    //      this.playlist = playlist;
    //    },
    //    ( error:any ) => {
    //      alertify.error("We can't find the Soundroom you've asked for");
    //      //this.errorMessage = <any>error;
    //    }
    //  );


  }
}
