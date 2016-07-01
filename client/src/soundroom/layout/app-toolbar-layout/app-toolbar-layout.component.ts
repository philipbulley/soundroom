import {Component, ChangeDetectionStrategy, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Observable} from 'rxjs/Observable';

import {Auth} from "../../model/auth";

@Component({
  selector: 'app-toolbar',
  template: require('./app-toolbar-layout.html'),
  styles: [require('./app-toolbar-layout.scss')],
  directives: [ROUTER_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppToolbarLayout implements OnInit {

  @Input('auth')
  auth:Observable<Auth>;

  constructor() {

  }

  ngOnInit():any {
    // console.log('AppToolbarLayoutComponent.ngOnInit()', this.auth$);
  }

}
