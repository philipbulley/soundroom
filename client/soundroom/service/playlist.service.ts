import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import {Config} from '../model/config';
import {PLAYLISTS} from './mock-playlists';
import {Playlist} from '../model/playlist';

@Injectable()
export class PlaylistService {

  playlists:Observable<Array<Playlist>>;

  private endpoint:string = '/playlists';
  private playlistsStore:Playlist[];
  private playlistsObserver:Observer<Playlist[]>;

  constructor( private http:Http ) {

    // Create an Observable to wrap our data store
    this.playlists = new Observable(observer => {
      this.playlistsObserver = observer;

      // Trigger a load of the data set upon the first subscription to this Observable
      this.load();
    })
    // Ensure 2nd-Nth subscribers get the most recent data on subscribe (not sure why shareReplay() was removed from RxJS 5 - asked here: http://stackoverflow.com/questions/35246873/sharereplay-in-rxjs-5)
      .publishReplay(1).refCount();
  }

  /**
   * Starts load of the full data set.
   */
  load():void {
    console.log('PlaylistService.load():', Config.API_BASE_URL + this.endpoint);

    this.http.get(Config.API_BASE_URL + this.endpoint)
      .map(res => res.json())
      .subscribe(( data ) => {
        // Assign initial data to store
        this.playlistsStore = data;

        // Push update to Observer
        this.playlistsObserver.next(this.playlistsStore);

        //setTimeout(() => this.playlistsObserver.next(this.playlistsStore.splice(0,2)), 2000);    // Debug - change data
      }, ( error ) => {
        console.error(error);
      });
  }

  deletePlaylist( playlist:Playlist ):Observable<boolean> {
    return this.http.delete(Config.API_BASE_URL + this.endpoint + '/' + playlist._id)
      .map(( res ) => {
        console.log('PlaylistService.deletePlaylist() map: status:', res.headers.status, 'splice:', playlist);

        // Delete success - reflect change in local data store
        this.playlistsStore.splice(this.playlistsStore.indexOf(playlist), 1);

        // Push updated store to the Observable
        this.playlistsObserver.next(this.playlistsStore);

        return res.headers.status === 204;
      })
      .catch(error => console.error(error));
  }
}
