/// <reference path="../definition/angular2/angular2.d.ts" />

import {Component, View, bootstrap, For} from 'angular2/angular2';
import {TestService} from 'spotidrop/TestService';

@Component({
    selector: 'spotidrop',
    injectables: [TestService]
})
@View({
    templateUrl: '../partials/spotidrop.html',
    directives: [For]
})

class Spotidrop {
    name:string;
    people:string[];

    constructor( testService:TestService ) {
        this.name = 'Spotidrop running in Angular 2!';
        this.people = testService.names;
    }
}

bootstrap(Spotidrop);