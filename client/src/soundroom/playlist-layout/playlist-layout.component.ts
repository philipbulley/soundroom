import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/distinctUntilChanged';
import { Playlist } from '../shared/model/playlist';
import { PlaylistCollection } from '../shared/model/playlist-collection';
import { AppState } from '../shared/model/app-state';
import { User } from '../shared/model/user';
import { PlaylistLoadAction } from '../shared/store/playlist-collection/playlist-load/playlist-load.action';

@Component({
  selector: 'sr-playlist-layout',
  template: require('./playlist-layout.html'),
  styles: [require('./playlist-layout.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistLayoutComponent implements OnInit {
  private playlist$: Observable<Playlist>;
  private id: string;
  private playlistCollection$: Observable<PlaylistCollection>;
  private user$: Observable<User>;
  private isLoading: boolean;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>) {
    // console.log('PlaylistLayoutComponent(): route:', route);
  }

  ngOnInit(): any {
    // console.log('PlaylistLayoutComponent.ngOnInit()');

    this.id = this.route.snapshot.params['id'];

    this.playlistCollection$ = this.store$.map((state: AppState) => state.playlistCollection);
    this.user$ = this.store$.map((state: AppState) => state.auth.user);

    this.playlist$ = this.playlistCollection$
      .distinctUntilChanged()
      .map((playlistCollection: PlaylistCollection) => {

        this.isLoading = !!playlistCollection.loadState;

        return playlistCollection.playlists
          .find((playlist: Playlist) => playlist._id === this.id);
      });

    this.store$.dispatch(new PlaylistLoadAction(this.id));
  }

}
