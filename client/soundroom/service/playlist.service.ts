import {Injectable} from 'angular2/core';

import {PLAYLISTS} from './mock-playlists';
import {Playlist} from '../model/playlist';

export class PlaylistService {

  getPlaylists():Promise<Playlist[]> {
    return Promise.resolve(PLAYLISTS);
  }

}
