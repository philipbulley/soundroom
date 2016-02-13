import {Injectable, EventEmitter} from 'angular2/core';
import {Http, Response, RequestOptions, Headers} from 'angular2/http';

import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import {Config} from '../model/config';
import {Playlist} from '../model/playlist';
import {PlaylistCreateBody} from "./playlist-create-body";

@Injectable()
export class PlaylistService {

  playlists:Observable<Array<Playlist>>;

  onSlowConnection:EventEmitter<boolean> = new EventEmitter();

  private endpoint:string = '/playlists';
  private playlistsStore:Playlist[];
  private playlistsObserver:Observer<Playlist[]>;

  private MAX_RETRY_INTERVAL:number = 30;
  private SLOW_CONNECTION_RETRIES:number = 2;
  private postOptions:RequestOptions;

  constructor( private http:Http ) {

    this.postOptions = new RequestOptions({
      headers: new Headers({'Content-Type': 'application/json'})
    });

    // Create an Observable to wrap our data store
    this.playlists = new Observable(( observer:Observer<Playlist[]> ) => {
      this.playlistsObserver = observer;

      // Trigger a load of the data set upon the first subscription to this Observable
      this.load();    // TODO: Consider removing so we can choose which data is loaded (ie. /playlists or /playlists/:id)
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
      .retryWhen(errors => this.retry(errors))
      //.timeout(120 * 1000, new Error('Timeout'))
      .map(res => res.json())
      .subscribe(( data ) => {
        this.onSlowConnection.emit(false);

        // Assign initial data to store
        this.playlistsStore = data;

        // Push update to Observer
        this.playlistsObserver.next(this.playlistsStore);

        //setTimeout(() => this.playlistsObserver.next(this.playlistsStore.splice(0,2)), 2000);    // Debug - change data
      }, ( error:Response ) => {
        console.error(error);

        return Observable.throw(error || 'Server error');
      });
  }

  create( name:string, description?:string ):Observable<boolean> {

    var body:PlaylistCreateBody = {
      name: name
    };

    if (description) {
      body.description = description;
    }

    //var req = new Request(options);

    console.log('PlaylistService.create() call post:', Config.API_BASE_URL + this.endpoint, JSON.stringify(body), this.postOptions);

    return this.http.post(Config.API_BASE_URL + this.endpoint, JSON.stringify(body), this.postOptions)
      .map(( res ) => {
        let body = res.json();

        console.log('PlaylistService.create() map: status:', res.headers.get('status'), 'body:', body);

        // Add new playlist to store
        this.playlistsStore.push(body);

        // Push updated store to the Observable — is this required? Works without.
        //this.playlistsObserver.next(this.playlistsStore);

        return res.headers.get('status') === '200';
      }).catch(( error:Response ) => {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  deletePlaylist( playlist:Playlist ):Observable<boolean> {
    return this.http.delete(Config.API_BASE_URL + this.endpoint + '/' + playlist._id)
      .map(( res ) => {
        console.log('PlaylistService.deletePlaylist() map: status:', res.headers.get('status'), 'splice:', playlist);

        // Delete success - reflect change in local data store
        this.playlistsStore.splice(this.playlistsStore.indexOf(playlist), 1);

        // Push updated store to the Observable
        this.playlistsObserver.next(this.playlistsStore);

        return res.headers.get('status') === '204';
      }).catch(( error:Response ) => {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  /**
   * Use with the `retryWhen()` operator for an exponential backoff retry strategy
   *
   * @example
   *
   *     Observable.retryWhen(errors => this.retry(errors))
   *
   * @param errors
   * @returns {Observable<R>}
   */
  private retry( errors:Observable<any> ):Observable<any> {
    return errors
      .mergeMap(( err, count ) => {
        // Emit event if we've retried SLOW_CONNECTION_RETRIES times
        if (count === this.SLOW_CONNECTION_RETRIES) {
          this.onSlowConnection.emit(true);
        }

        // Calc number of seconds we'll retry in using incremental backoff
        var retrySecs = Math.min(Math.round(Math.pow(++count, 2)), this.MAX_RETRY_INTERVAL);
        console.warn(`PlaylistService.load(): Retry ${count} in ${retrySecs} seconds`);

        // Set delay
        return Observable.of(err)
          .delay(retrySecs * 1000);
      });
  }
}
