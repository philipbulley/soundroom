import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Auth } from '../../shared/model/auth';

@Component({
  selector: 'sr-app-toolbar',
  template: require('./app-toolbar-layout.html'),
  styles: [require('./app-toolbar-layout.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToolbarComponent implements OnInit {

  // TODO: No need for Observable here
  @Input()
  auth: Observable<Auth>;

  ngOnInit(): any {
    // console.log('AppToolbarLayoutComponent.ngOnInit()', this.auth$);
  }

}
