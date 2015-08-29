# Spotidrop Client

Democratic playlist client for Spotify.

## Build

There is no proper build process yet. Probably wont implement this until Angular 2 is fully released, it's still in beta at time of writing.

## Setting up Angular 2

Note: This is currently using the Angular 2 Beta (which uses Typescript 1.5 beta). These instructions will change as it's a super basic workflow.

    $ npm install -g typescript@^1.5.0

## Compiling the Client App

    $ tsc --watch -m commonjs -t es5 --emitDecoratorMetadata src/script/spotidrop/Spotidrop.ts

## Serving the client app

    $ cd ./client
    $ npm install -g http-server  # Or sudo npm install -g http-server
    $ http-server                 # Creates a server at localhost:8080
