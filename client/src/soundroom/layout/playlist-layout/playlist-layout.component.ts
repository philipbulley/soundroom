import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/distinctUntilChanged';

import { PlaylistService } from "../../service/playlist.service";
import { Playlist } from "../../model/playlist";
import { PlaylistCollection } from "../../model/playlist-collection";
import { NowPlayingComponent } from "../../component/now-playing/now-playing.component";
import { TrackSearchComponent } from "../../component/track-search/track-search.component";
import { PlaylistQueueComponent } from "../../component/playlist-queue/playlist-queue.component";
import { AuthService } from "../../service/auth.service";
import { DropUrlComponent } from "../../component/drop-url/drop-url.component";
import { AppState } from "../../../boot";

@Component({
  selector: 'playlist-layout',
  template: require('./playlist-layout.html'),
  styles: [require('./playlist-layout.scss')],
  directives: [
    NowPlayingComponent,
    TrackSearchComponent,
    PlaylistQueueComponent,
    DropUrlComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistLayout implements OnInit {
  private playlist$: Observable<Playlist>;
  private id: string;
  private playlistCollection$: Observable<PlaylistCollection>;
  private isLoading: boolean;
  private jwt: string;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>, private playlistService: PlaylistService, private authService: AuthService) {
    // console.log('PlaylistLayout(): route:', route);
    this.jwt = authService.jwt;   // for debug in template
  }

  ngOnInit(): any {
    // console.log('PlaylistLayout.ngOnInit()');

    this.id = this.route.snapshot.params['id'];

    this.playlistCollection$ = this.store$.map((state: AppState) => state.playlistCollection);

    this.playlist$ = this.playlistCollection$
      .distinctUntilChanged()
      .map((playlistCollection: PlaylistCollection) => {

        this.isLoading = !!playlistCollection.loadState;

        return playlistCollection.playlists
          .find((playlist: Playlist) => playlist._id === this.id);
      });

    this.playlistService.load(this.id);
  }

}
