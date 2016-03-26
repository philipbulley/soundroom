import {Injectable} from 'angular2/core';
import {BrowserXhr} from 'angular2/http';

@Injectable()
export class WithCredentialsBrowserXhr extends BrowserXhr {

  constructor(){
    super();
    console.log('WithCredentialsBrowserXhr()');
  }

  build():any {
    console.log('WithCredentialsBrowserXhr.build()');
    let xhr = super.build();
    xhr.withCredentials = true;
    return <any>xhr;
  }
}
