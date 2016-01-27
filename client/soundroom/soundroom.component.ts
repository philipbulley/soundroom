import {Component} from 'angular2/core';
//import {TestService} from 'spotidrop/TestService';

@Component({
    selector: 'soundroom',
    //injectables: [TestService]
    templateUrl: 'soundroom/soundroom.html'
})
export class SoundroomComponent {
    name:string;
    people:string[];

    constructor( /*testService:TestService*/ ) {
        this.name = 'Soundroom component stub running in Angular 2!';
        //this.people = testService.names;
    }
}