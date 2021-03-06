import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SocketService } from './shared/service/socket.service';
import { Auth } from './shared/model/auth';
import { AppState } from './shared/model/app-state';
import { AppInitAction } from './shared/store/app-init/app-init.action';

@Component({
  selector: 'sr-app',
  template: require('./app.component.html'),
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit {

  private auth$: Observable<Auth>;

  constructor(private store$: Store<AppState>, private socketService: SocketService) {
    // console.log('AppComponent()');

    //console.log('%c♪ ♫ ♬  Soundroom  ♬ ♫ ♪', 'background-color:#3fa2db;color:#fff;padding:20px
    // 20px;font-size:30px;font-weight:bold;text-align:center;text-shadow:0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0
    // 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px
    // rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15)');
    console.log('%c' + new Date, 'color:#fff;padding:0 20px');

  }

  ngOnInit(): any {
    this.store$.dispatch(new AppInitAction());

    this.auth$ = this.store$.select((state: AppState) => state.auth);
  }
}
