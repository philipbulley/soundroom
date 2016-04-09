import {Injectable, EventEmitter} from 'angular2/core';
import {Http, Response} from 'angular2/http';

import {Observable} from 'rxjs/Observable';
import {ConnectableObservable} from 'rxjs/observable/ConnectableObservable';
import {Store} from '@ngrx/store';

import {Config} from '../model/config';
import {Playlist} from '../model/playlist';
import {PlaylistCreateBody} from "./playlist-create-body";
import {PlaylistAction} from "../model/action/playlist.action.ts";
import {PlaylistCreate} from "../model/playlist-create";
import {PlaylistCreateAction} from "../model/action/playlist-create.action.ts";
import {PlaylistCreateState} from "../model/state/playlist-create.state.ts";
import {PlaylistFactory} from "../model/factory/playlist.factory";
import {NetworkService} from "./network.service";
import {SocketService} from "./socket.service";
import {SocketEventTypeEnum} from "../model/socket/socket-event-type.enum.ts";
import {PlaylistCollectionAction} from "../model/action/playlist-collection.action.ts";
import {PlaylistProgressSocketEvent} from "../model/socket/playlist-progress-socket-event";

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

  private playlistCreate$:Observable<PlaylistCreate>;

  constructor( private http:Http, public store:Store<PlaylistCreate>, public networkService:NetworkService, private socketService:SocketService ) {
    this.playlistCreate$ = this.store.select('playlistCreate');

    this.observeCreate();
    this.observeSocket();
  }

  /**
   * Starts load of the full data set.
   */
  loadCollection():void {
    console.log('PlaylistService.loadCollection():', Config.API_BASE_URL + this.API_ENDPOINT);

    this.store.dispatch({type: PlaylistCollectionAction.LOADING});

    this.http.get(Config.API_BASE_URL + this.API_ENDPOINT, this.networkService.requestOptions)
      // .delay(2000)    // DEBUG: Delay for simulation purposes only
      .retryWhen(errors => this.networkService.retry(errors))
      .map(( res:Response ) => res.json())
      .subscribe(( data ) => {
        this.onSlowConnection.emit(false);

        // Add initial data to the Store
        this.store.dispatch({type: PlaylistCollectionAction.ADD, payload: data});
      }, ( error:Response ) => {
        console.error(error);

        this.store.dispatch({type: PlaylistCollectionAction.ERROR_LOADING});

        return Observable.throw(error || 'Server error');
      });
  }

  /**
   * Loads the full data of a single playlist
   * @param id
   */
  load( id:string ):any {
    this.store.dispatch({type: PlaylistAction.LOADING, payload: id});

    this.http.get(Config.API_BASE_URL + this.API_ENDPOINT + '/' + id, this.networkService.requestOptions)
      // .delay(2000)    // DEBUG: Delay for simulation purposes only
      .retryWhen(errors => this.networkService.retry(errors))
      .map(( res:Response ) => PlaylistFactory.createFromApiResponse(res.json()))
      .subscribe(( data ) => {
        this.onSlowConnection.emit(false);

        // Assign initial data to collection
        this.store.dispatch({type: PlaylistCollectionAction.ADD, payload: data});
      }, ( error:Response ) => {
        console.error(error);

        this.store.dispatch({type: PlaylistAction.ERROR_LOADING, payload: id});

        return Observable.throw(error || 'Server error');
      });
  }


  deletePlaylist( playlist:Playlist ):Observable<boolean> {
    this.store.dispatch({type: PlaylistCollectionAction.DELETING, payload: playlist._id});

    return this.http.delete(Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlist._id, this.networkService.requestOptions)
      .map(( res:Response ) => {
        console.log('PlaylistService.deletePlaylist() map: status:', res.headers.get('status'), 'splice:', playlist);

        // Delete success - reflect change in local data collection
        this.store.dispatch({type: PlaylistCollectionAction.DELETE, payload: playlist});

        return res.status === 204;
      }).catch(( error:Response ) => {
        console.error(error);

        this.store.dispatch({type: PlaylistCollectionAction.ERROR_DELETING, payload: playlist});

        return Observable.throw(error.json().error || 'Server error');
      });
  }

  play( playlistId:string ) {
    this.socketService.emit(SocketEventTypeEnum.PLAYLIST_PLAY, playlistId);
  }

  pause( playlistId:string ) {
    this.socketService.emit(SocketEventTypeEnum.PLAYLIST_PAUSE, playlistId);
  }


  /////////////////////////
  // PRIVATE METHODS
  /////////////////////////

  /**
   * Observe changes to the `playlistCreate` store and react as appropriate.
   */
  private observeCreate() {
    this.playlistCreate$
      .filter(( playlistCreate:PlaylistCreate ) => playlistCreate.state === PlaylistCreateState.CREATING)
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
        this.store.dispatch({type: PlaylistCollectionAction.ADD, payload: newPlaylist});
      }, error => this.store.dispatch({type: PlaylistCreateAction.ERROR, payload: error}));
  }

  private create( name:string, description?:string ):Observable<Playlist> {
    console.log('PlaylistCreateService.create:', name, description);

    var body:PlaylistCreateBody = {
      name: name
    };

    if (description) {
      body.description = description;
    }

    return this.http.post(Config.API_BASE_URL + this.API_ENDPOINT, JSON.stringify(body), this.networkService.requestOptions)
      .map(( res:Response ) => PlaylistFactory.createFromApiResponse(res.json()))
      .catch(( error:Response ) => {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  private observeSocket() {
    this.socketService.stream$.subscribe(( event ) => {

      console.log('PlaylistService.observeSocket: subscribe():', event);

      switch (event.type) {

        case SocketEventTypeEnum.PLAYLIST_TRACK_PROGRESS:

          let data:PlaylistProgressSocketEvent = event.data;
          // TODO: Send action to playlistCollection reducer to ensure the correct playlist+track is marked as 'now playing'.

          break;

      }

    });
  }

}
