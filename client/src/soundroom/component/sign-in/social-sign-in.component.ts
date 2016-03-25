import {Component, ChangeDetectionStrategy} from 'angular2/core';
import {Config} from "../../model/config";

@Component({
  selector: 'social-sign-in',
  template: require('./social-sign-in.html'),
  styles: [require('./social-sign-in.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialSignInComponent {

  private redirectUrl:string;
  private serverBaseUrl:string;

  constructor() {

    this.redirectUrl = document.location.protocol + '//' + document.location.host;
    this.serverBaseUrl = Config.SERVER_BASE_URL;

  }
}
