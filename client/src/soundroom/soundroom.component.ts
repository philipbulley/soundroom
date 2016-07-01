import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';

import 'rxjs/Rx';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
var alertify = require('alertify.js');

import {PlaylistService} from "./service/playlist.service";
import {AuthService} from "./service/auth.service";
import {NetworkService} from "./service/network.service";
import {SocketService} from "./service/socket.service";
import {Auth} from "./model/auth";
import {AppToolbarLayout} from "./layout/app-toolbar-layout/app-toolbar-layout.component";
import {SpotifyService} from "./service/spotify.service";
import {AppState} from "../boot";

@Component({
  selector: 'soundroom',
  directives: [...ROUTER_DIRECTIVES, AppToolbarLayout],
  template: require('./soundroom.html'),
  providers: [...HTTP_PROVIDERS, PlaylistService, AuthService, NetworkService, SocketService, SpotifyService],
  styles: [require('./soundroom.scss')]
})
export class SoundroomComponent implements OnInit {

  private auth:Observable<Auth>;

  constructor( private store:Store<AppState>, private socketService:SocketService) {

    console.log('SoundroomComponent()');

    //console.log('%c♪ ♫ ♬  Soundroom  ♬ ♫ ♪', 'background-color:#3fa2db;color:#fff;padding:20px 20px;font-size:30px;font-weight:bold;text-align:center;text-shadow:0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15)');
    console.log('%c' + new Date, 'color:#fff;padding:0 20px');

  }

  ngOnInit():any {

    console.log('SoundroomComponent.ngOnInit():', this.store.select('auth'));

    this.store.select('auth').subscribe(auth => {
      console.log('SoundroomComponent.ngOnInit: subscribe(): auth:', auth);
    });

    // Global config for alertify
    alertify.logPosition("top right");
    alertify.delay(8000);

    this.auth = <Observable<Auth>>this.store.select('auth');

    this.socketService.init();

  }


}
