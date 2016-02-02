import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';

import {Observable}     from 'rxjs/Observable';

import {Config} from '../model/config';
import {PLAYLISTS} from './mock-playlists';
import {Playlist} from '../model/playlist';

@Injectable()
export class PlaylistService {

  private endpoint:string = '/playlists';

  playlists:Playlist[];

  constructor( private http:Http ) {

  }

  getPlaylists():Observable<Playlist[]> {
    //return Promise.resolve(PLAYLISTS);
    console.log('PlaylistService.getPlaylists():', Config.API_BASE_URL + this.endpoint);

    return this.http.get(Config.API_BASE_URL + this.endpoint)
      //.map(res => <Playlist[]> res.json().data)
      .map(( res ) => {
        this.playlists = <Playlist[]> res.json();
        console.log('PlaylistService.getPlaylists(): map:', res);

        return this.playlists;
      })
      .catch(( error ) => {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

  deletePlaylist( playlist:Playlist ):Observable<boolean> {
    return this.http.delete(Config.API_BASE_URL + this.endpoint + '/' + playlist._id)
      .map(( res ) => {

        console.log('PlaylistService.deletePlaylist() map: status:', res.headers.status, 'splice:', playlist);
        this.playlists.splice(this.playlists.indexOf(playlist), 1);

        return res.headers.status === 204;
      });
  }
}
