import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Auth } from '../../shared/model/auth';

@Component({
  selector: 'sr-app-toolbar',
  template: require('./app-toolbar-layout.component.html'),
  styles: [require('./app-toolbar-layout.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToolbarComponent {

  @Input() auth: Auth;

}
