import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Config } from "../../shared/model/config";

@Component({
  selector: 'sr-social-sign-in',
  template: require('./social-sign-in.component.html'),
  styles: [require('./social-sign-in.component.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialSignInComponent {

  private serverBaseUrl: string;

  constructor() {

    this.serverBaseUrl = Config.SERVER_BASE_URL;

  }
}
