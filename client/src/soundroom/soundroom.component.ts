import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';


import {PlaylistService} from "./shared/service/playlist.service";
import {SocketService} from "./shared/service/socket.service";
import {Auth} from "./shared/model/auth";
import {AppToolbarLayout} from "./layout/app-toolbar-layout/app-toolbar-layout.component";
import {SpotifyService} from "./shared/service/spotify.service";
import {AppState} from "../boot";
import {AlertifyComponent} from "./component/alertify/alertify.component";

@Component({
  selector: 'soundroom',
  directives: [...ROUTER_DIRECTIVES, AppToolbarLayout, AlertifyComponent],
  template: require('./soundroom.html'),
  providers: [PlaylistService, SpotifyService],
  styles: [require('./soundroom.scss')],
})
export class SoundroomComponent implements OnInit {

  private auth:Observable<Auth>;

  constructor( private store:Store<AppState>, private socketService:SocketService ) {

    // console.log('SoundroomComponent()');

    //console.log('%c♪ ♫ ♬  Soundroom  ♬ ♫ ♪', 'background-color:#3fa2db;color:#fff;padding:20px 20px;font-size:30px;font-weight:bold;text-align:center;text-shadow:0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15)');
    console.log('%c' + new Date, 'color:#fff;padding:0 20px');

  }

  ngOnInit():any {

    this.auth = <Observable<Auth>>this.store.select('auth');

    this.socketService.init();

  }


}
