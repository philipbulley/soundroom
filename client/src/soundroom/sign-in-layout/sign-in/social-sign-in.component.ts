import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Config } from "../../shared/model/config";

@Component({
  selector: 'sr-social-sign-in',
  template: require('./social-sign-in.html'),
  styles: [require('./social-sign-in.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialSignInComponent {

  private serverBaseUrl: string;

  constructor() {

    this.serverBaseUrl = Config.SERVER_BASE_URL;

  }
}
