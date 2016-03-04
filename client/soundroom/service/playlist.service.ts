import {Injectable, EventEmitter} from 'angular2/core';
import {Http, Response, RequestOptions, Headers} from 'angular2/http';

import {Observable, ConnectableObservable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Store} from '@ngrx/store';

import {Config} from '../model/config';
import {Playlist} from '../model/playlist';
import {PlaylistCreateBody} from "./playlist-create-body";
import {PlaylistAction} from "../model/enum/playlist-action";
import {PlaylistCreate} from "../model/playlist-create";
import {PlaylistCreateAction} from "../model/enum/playlist-create-action";
import {PlaylistCreateState} from "../model/enum/playlist-create-state";
import {PlaylistCollection} from "../model/playlist-collection";

@Injectable()
export class PlaylistService {

  /**
   * An `Observable` that can be subscribed to for playlist data. Use this in components to the data of access one or
   * more playlists.
   * @deprecated
   */
  playlists:ConnectableObservable<Playlist[]>;

  /**
   * TODO refactor into it's own connection service?
   * @type {EventEmitter}
   */
  onSlowConnection:EventEmitter<boolean> = new EventEmitter();

  /**
   * Location of RESTful resource on server
   * @type {string}
   */
  private API_ENDPOINT:string = '/playlists';

  /**
   * An exponential backoff strategy is used when loading playlist data, but we won't allow that exponential delay
   * exceed this value.
   * @type {number}
   */
  private MAX_RETRY_INTERVAL:number = 30;

  /**
   * On this number of retries (within the exponential backoff strategy), we will emit our slow connection. This may be
   * communicated to the user via UI.
   * @type {number}
   */
  private SLOW_CONNECTION_RETRIES:number = 2;

  /**
   * A simple array holding all of the `Playlist` model objects. This can be accessed via subscribing to the public
   * `playlists` Observable on this service.
   */
  private playlistsCollection:Playlist[];

  /**
   * The observer that the `playlistsCollection` is pushed to when `playlistsCollection` has changed.
   */
  private playlistsObserver:Observer<Playlist[]>;

  /**
   * Standard options we need to use when sending POST requests to the server
   */
  private postOptions:RequestOptions;
  private playlistCreate$:Observable<PlaylistCreate>;

  constructor( private http:Http, public store:Store ) {
    this.postOptions = new RequestOptions({
      headers: new Headers({'Content-Type': 'application/json'})
    });

    this.playlistCreate$ = this.store.select('playlistCreate');

    this.initObservable();
    this.initCreate();
  }

  /**
   * Starts load of the full data set.
   */
  load():void {
    console.log('PlaylistService.load():', Config.API_BASE_URL + this.API_ENDPOINT);

    this.store.dispatch({type: PlaylistAction.LOAD_ALL});

    this.http.get(Config.API_BASE_URL + this.API_ENDPOINT)
      .delay(2000)    // DEBUG: Delay for simulation purposes only
      .retryWhen(errors => this.retry(errors))
      .map(res => res.json())
      .subscribe(( data ) => {
        this.onSlowConnection.emit(false);

        // Assign initial data to collection
        //this.playlistsCollection = data;
        this.store.dispatch({type: PlaylistAction.ADD, payload: data});
        //this.store.dispatch({type: ADD_PLAYLIST, payload: 1});

        // Push update to Observer
        //this.playlistsObserver.next(this.playlistsCollection);
      }, ( error:Response ) => {
        console.error(error);

        return Observable.throw(error || 'Server error');
      });
  }

  initCreate() {
    this.playlistCreate$
      //.filter(action => action.type === PlaylistCreateAction.CREATE)
      .filter(( playlistCreate:PlaylistCreate ) => {
        console.log('PlaylistService.initCreate: filter:', playlistCreate);

        return playlistCreate.state === PlaylistCreateState.CREATING;
      })
      .mergeMap(( playlistCreate:PlaylistCreate ) => this.create(
        playlistCreate.name,
        playlistCreate.description
      ))
      .subscribe(( newPlaylist:Playlist ) => {
        console.log('PlaylistService.initCreate: subscribe:', newPlaylist);

        // TODO: It would be amazing if we could type this payload to Playlist|Playlist[]
        // For the benefit of notifying PlaylistCreateComponent that we're successful
        this.store.dispatch({type: PlaylistCreateAction.SUCCESS, payload: newPlaylist});

        // Separate action to actually add new playlist to our collection.
        this.store.dispatch({type: PlaylistAction.ADD, payload: newPlaylist});
      }, error => this.store.dispatch({type: PlaylistCreateAction.ERROR, payload: error}));
  }

  create( name:string, description?:string ):Observable<Playlist> {

    console.log('PlaylistCreateService.create:', name, description);

    var body:PlaylistCreateBody = {
      name: name
    };

    if (description) {
      body.description = description;
    }

    console.log('PlaylistService.create() call post:', Config.API_BASE_URL + this.API_ENDPOINT, JSON.stringify(body), this.postOptions);

    return this.http.post(Config.API_BASE_URL + this.API_ENDPOINT, JSON.stringify(body), this.postOptions)
      .map(( res ) => {
        let playlist:Playlist = res.json();

        console.log('PlaylistService.create() map: status:', res.headers.get('status'), 'playlist:', playlist);

        //// Add new playlist to collection
        //this.playlistsCollection = [...this.playlistsCollection, playlist];
        //
        //// Push updated collection to the Observer
        //this.playlistsObserver.next(this.playlistsCollection);

        console.log('status', res.headers.get('status'), 'headers', res.headers);


        return playlist;
      }).catch(( error:Response ) => {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  deletePlaylist( playlist:Playlist ):Observable<boolean> {
    return this.http.delete(Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlist._id)
      .map(( res ) => {
        console.log('PlaylistService.deletePlaylist() map: status:', res.headers.get('status'), 'splice:', playlist);

        // Delete success - reflect change in local data collection
        this.store.dispatch({type: PlaylistAction.DELETE, payload: playlist});

        return res.status === 204;
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

  /**
   * Creates the hot playlists Observable that cn be usd throughout the app to subscribe to playlist data and changes.
   */
  private initObservable():void {
    // Create an Observable to wrap our data collection
    this.playlists = new Observable(( observer:Observer<Playlist[]> ) => {
      this.playlistsObserver = observer;

      // Trigger a load of the data set upon the first subscription to this Observable
      this.load();    // TODO: Consider removing so we can choose which data is loaded (ie. /playlists or /playlists/:id)

      return () => {
        console.log('%cPlaylistService dispose!', 'background-color:#f00;color:#fff;padding:2px 5px;font-weight:bold');
      }
    })
    // Ensure the 2nd+ subscribers get the most recent data on subscribe (not sure why shareReplay() was removed from RxJS 5 - asked here: http://stackoverflow.com/questions/35246873/sharereplay-in-rxjs-5)
      .publishReplay(1);

    // Connect to keep this Observable hot, even after all components have unsubscribed
    // BTW - I like the idea of `.publishReplay(1).refCount()` which makes the Observable cold once all have
    // unsubscribed, but ng throws "Error: Cannot subscribe to a disposed Subject" when trying to subscribe after
    // being cold (ie. when changing route). Not sure if this is to be expected?
    this.playlists.connect();
  }
}
