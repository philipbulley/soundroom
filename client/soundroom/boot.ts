import {bootstrap} from 'angular2/platform/browser'
import {ROUTER_PROVIDERS} from 'angular2/router';

import {SoundroomComponent} from './soundroom.component'

bootstrap(SoundroomComponent, [
    ROUTER_PROVIDERS
]);

//console.log('hello!');