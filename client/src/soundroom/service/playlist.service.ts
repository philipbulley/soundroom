import {Injectable, EventEmitter} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {ConnectableObservable} from 'rxjs/observable/ConnectableObservable';
import {Store} from '@ngrx/store';

import {Config} from '../model/config';
import {Playlist} from '../model/playlist';
import {PlaylistCreateBody} from "./vo/playlist-create-body";
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
import {PlaylistSocketEvent} from "../model/socket/playlist-socket-event";
import {ProviderEnum} from "../model/enum/provider.enum";
import {PlaylistAddTrackBody} from "./vo/playlist-add-track-body";
import {PlaylistTrackFactory} from "../model/factory/playlist-track.factory";
import {PlaylistTracksChangeActionEnum} from "../model/socket/playlist-tracks-change-action.enum";
import {PlaylistTracksChangeSocketEvent} from "../model/socket/playlist-tracks-change-socket-event";
import {PlaylistTrack} from "../model/playlist-track";
import {AppState} from "../../boot";
import {PlaylistError} from "../model/error/PlaylistError";
import {User} from "../model/user";

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
  onSlowConnection:EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Location of RESTful resource on server
   * @type {string}
   */
  private API_ENDPOINT:string = '/playlists';

  private playlistCreate$:Observable<PlaylistCreate>;

  constructor( private http:Http, public store:Store<AppState>, public networkService:NetworkService, private socketService:SocketService ) {
    this.playlistCreate$ = <Observable<PlaylistCreate>>this.store.select('playlistCreate');

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

  upVote( playlist:Playlist, playlistTrack:PlaylistTrack ) {
    console.log('PlaylistService.upVote:', playlist, playlistTrack);

    this.socketService.emit(SocketEventTypeEnum.PLAYLIST_TRACK_UPVOTE, {
      playlistId: playlist._id,
      playlistTrackId: playlistTrack._id
    });
  }

  /**
   * Makes request to add a track on the server. Notifies the redux state tree at the relevant points.
   *
   * @param playlist      The `Playlist` being added to.
   * @param provider      The provider of the track.
   * @param foreignId     The ID of the track according to the provider.
   * @returns {Observable<number>}  Observable with HTTP status of the request if successful.
   */
  addTrack( playlist:Playlist, provider:ProviderEnum, foreignId:string ):Observable<any> {
    this.store.dispatch({type: PlaylistAction.ADDING_TRACK, payload: {playlist}});

    var body:PlaylistAddTrackBody = {
      provider: <string><any>provider,
      foreignId
    };

    console.log('PlaylistService.addTrack: call POST:',
      Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlist._id + '/tracks',
      body,
      this.networkService.requestOptions);

    const observable = this.http.post(
      Config.API_BASE_URL + this.API_ENDPOINT + '/' + playlist._id + '/tracks',
      JSON.stringify(body),
      this.networkService.requestOptions
    )
      .publishReplay(1) // Use publishReplay to allow multiple subscriptions, but only one request/result
      .refCount();

    observable.subscribe(( res:Response ) => {
      // NOTE: Track is added to state tree via socket event handler, as all clients will receive that event.
    }, ( error:Response ) => {
      // Dispatch redux action
      this.store.dispatch({type: PlaylistAction.ERROR_ADDING_TRACK, payload: {playlist}});
    });

    return observable
      .map(( res:Response ) => res.status)
      .catch(( error:Response ) => {
        // console.error(error);
        // Re-throw actual error so the requesting method can act on it
        const errorJson = error.json();
        let errorThrow;

        if (errorJson.hasOwnProperty('message') && ~errorJson.message.indexOf('getaddrinfo ENOTFOUND')) {
          errorThrow = new PlaylistError(PlaylistError.PROVIDER_CONNECTION, null, playlist, error);
        } else if (errorJson.hasOwnProperty('message') && errorJson.message === 'DUPLICATE_USER_UP_VOTE') {
          errorThrow = new PlaylistError(PlaylistError.DUPLICATE_USER_UP_VOTE, null, playlist, error);
        } else if (error.status === 500) {
          errorThrow = new PlaylistError(PlaylistError.SERVER, null, playlist, error);
        } else {
          errorThrow = new PlaylistError(PlaylistError.UNKNOWN, null, playlist, error);
        }

        return Observable.throw(errorThrow);
      });
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
          this.store.dispatch({type: PlaylistAction.PROGRESS, payload: <PlaylistProgressSocketEvent>event.data});
          break;

        // NOTE: Don't really need to use PLAYLIST_PLAY as PROGRESS does the same job + more
        // case SocketEventTypeEnum.PLAYLIST_PLAY:
        //   this.store.dispatch({type: PlaylistAction.PLAY, payload: data});
        //   break;

        case SocketEventTypeEnum.PLAYLIST_PAUSE:
          this.store.dispatch({type: PlaylistAction.PAUSE, payload: <PlaylistSocketEvent>event.data});
          break;

        case SocketEventTypeEnum.PLAYLIST_TRACKS_CHANGE:
          const eventData:PlaylistTracksChangeSocketEvent = event.data;

          console.log('PlaylistService.observeSocket: SocketEventTypeEnum.PLAYLIST_TRACKS_CHANGE', event, eventData);

          switch (eventData.action) {
            case PlaylistTracksChangeActionEnum.ADD:
            case PlaylistTracksChangeActionEnum.COMPLETE:
            case PlaylistTracksChangeActionEnum.UP_VOTE:
              console.log('PlaylistService.observeSocket: ', eventData.action, eventData);
              const playlistTrack = PlaylistTrackFactory.createFromApiResponse(eventData.playlistTrack);

              // A track has been successfully added - reflect change in local data collection
              this.store.dispatch({
                type: eventData.action === PlaylistTracksChangeActionEnum.COMPLETE ||
                eventData.action === PlaylistTracksChangeActionEnum.UP_VOTE
                  ? PlaylistAction.UPDATE_TRACK
                  : PlaylistAction.ADD_TRACK,
                payload: {
                  playlistId: eventData.playlistId,
                  playlistTrack,
                  playlistTrackIds: eventData.playlistTrackIds
                }
              });
              break;
          }
          break;
      }

    });
  }

  /**
   * Determines whether the user specified can delete the track specified.
   *
   * @param playlistTrack
   * @param user
   * @returns {boolean}
   */
  canUserDeleteTrack( playlistTrack:PlaylistTrack, user:User ) {
    // TODO: Allow admins (when implemented) to delete tracks
    return playlistTrack.createdBy._id === user._id;
  }

  deleteTrack( playlistTrack:PlaylistTrack ) {
    console.log('TODO: Implement delete track:', playlistTrack.track.name);
  }
}
