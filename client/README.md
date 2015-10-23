# Spotidrop Client

Democratic playlist client for Spotify.

## Setup

    $ cd client
    $ npm install

WIP: Ensure that Typescript 1.5.0-beta or newer has been installed. We need to keep this up to date in conjunction with latest Angular 2 version.

## Build

To build everything:

    $ cd client
    $ gulp build

To watch:

    $ cd client
    $ gulp watch

## Serving the client app

    $ cd client/build
    $ npm install -g http-server  # Or sudo npm install -g http-server
    $ http-server                 # Creates a server at localhost:8080