import {Component, OnInit, OnDestroy} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import * as alertify from 'alertify';

import {PlaylistMenuComponent} from "../../component/playlist-menu/playlist-menu.component";
import {PlaylistService} from "../../service/playlist.service";
import {Playlist} from "../../model/playlist";

@Component({
  selector: 'playlist-layout',
  templateUrl: 'soundroom/layout/playlist-layout/playlist-layout.html',
  styleUrls: ['soundroom/layout/playlist-layout/playlist-layout.css'],
  directives: [PlaylistMenuComponent]
})
export class PlaylistLayout implements OnInit {
  private playlist:Playlist;
  private noPlaylist:boolean;

  constructor( private routeParams:RouteParams, private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    // TODO: Ask playlistService to load playist details endpoint instead of /playlists within observer creation


    //this.playlistService.playlists
    //  .map(playlists => {
    //    return playlists.filter(playlist=> playlist._id === this.routeParams.get('id'))[0]
    //  })
    //  .subscribe(
    //    playlist => {
    //      console.log('PlaylistLayout.ngOnInit(): subscribe:', playlist)
    //
    //      if (!playlist) {
    //        alertify.error("The Soundroom you've asked for doesn't exist");
    //        this.noPlaylist = true;
    //        return;
    //      }
    //
    //      this.playlist = playlist;
    //    },
    //    error => {
    //      alertify.error("We can't find the Soundroom you've asked for");
    //      //this.errorMessage = <any>error;
    //    }
    //  );
  }
}
