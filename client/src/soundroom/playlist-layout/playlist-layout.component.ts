import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/distinctUntilChanged';
import { Playlist } from '../shared/model/playlist';
import { PlaylistCollection } from '../shared/model/playlist-collection';
import { AppState } from '../shared/model/app-state';
import { PlaylistService } from '../shared/service/playlist.service';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'playlist-layout',
  template: require('./playlist-layout.html'),
  styles: [require('./playlist-layout.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistLayoutComponent implements OnInit {
  private playlist$: Observable<Playlist>;
  private id: string;
  private playlistCollection$: Observable<PlaylistCollection>;
  private isLoading: boolean;
  private jwt: string;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>, private playlistService: PlaylistService, private authService: AuthService) {
    // console.log('PlaylistLayoutComponent(): route:', route);
    this.jwt = authService.jwt;   // for debug in template
  }

  ngOnInit(): any {
    // console.log('PlaylistLayoutComponent.ngOnInit()');

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
