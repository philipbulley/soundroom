import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';

import {Playlist} from "../../model/playlist";
import {PlaylistService} from "../../service/playlist.service";

@Component({
  selector: 'playlist-menu',
  templateUrl: 'soundroom/component/playlist-menu/playlist-menu.html',
  styleUrls: ['soundroom/component/playlist-menu/playlist-menu.css']
})
export class PlaylistMenuComponent implements OnInit {
  public playlists:Playlist[];
  private errorMessage:any;

  constructor( private playlistService:PlaylistService ) {

  }

  ngOnInit():any {
    return this.playlistService.getPlaylists()
      .subscribe(playlists => this.playlists = playlists,
        error => this.errorMessage = <any>error);
    //.then(playlists => this.playlists = playlists);
  }
}
