# Spotidrop Client

Democratic playlist client for Spotify.

## Setup

    $ cd client
    $ npm install

## Build

To watch and open in browser (includes Browersync):

    $ cd client
    $ npm start

Build only:

    $ cd client
    $ npm build

## Implementation

Based on Angular 2 using SystemJS loader.

Not based on an existing seed project in order to avoid complexity for the time being. But the following seem to be the two contenders:

* [mgechev/angular2-seed](https://github.com/mgechev/angular2-seed) - SystemJS, Gulp, TypeScript, TSD, Versioned, Env Dev/Prod, Protractor, Karma, Jasmine, Env Dev/Prod
* [angular-class/angular2-webpack-starter](https://github.com/angular-class/angular2-webpack-starter) - Webpack, TypeScript, TSD, Protractor, Karma, Jasmine, Env Dev/Prod, Server API

The SystemJS implementation of [mgechev/angular2-seed](https://github.com/mgechev/angular2-seed) appears to be the flavour of the month right now, but with both seed projects getting almost daily updates, probably best to let them mature before jumping in.