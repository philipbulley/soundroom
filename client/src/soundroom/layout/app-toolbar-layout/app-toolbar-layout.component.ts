import {Component, ChangeDetectionStrategy, Input, OnInit} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {Observable} from 'rxjs/Observable';

import {AuthService} from "../../service/auth.service.ts";
import {Auth} from "../../model/auth";

@Component({
  selector: 'app-toolbar',
  template: require('./app-toolbar-layout.html'),
  styles: [require('./app-toolbar-layout.scss')],
  directives: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppToolbarLayout implements OnInit {

  @Input('auth')
  auth$:Observable<Auth>;

  // private auth:Auth;

  constructor(private authService:AuthService) {

  }

  ngOnInit():any {
    // console.log('AppToolbarLayoutComponent.ngOnInit()', this.auth$);
  }

}
