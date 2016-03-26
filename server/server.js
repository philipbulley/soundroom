import _ from 'lodash';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import log from './util/LogUtil';
import cors from 'cors';
import MongooseService from './service/MongooseService';
import spotifyService from './service/SpotifyService';
import {initAuth} from './controller/AuthController';
import {initModels} from './model/db';
import {initRoutes} from './controller/routes';
import {initSocket} from './controller/SocketController';


log.level = log.LEVEL_DEBUG;
log.info('__________________________________________________');
log.info('Hello! Starting Spotidrop initialization. Please wait...');

if (!process.env.MONGO_CONNECT)
  throw new Error('Please specify the MONGO_CONNECT env var. ie. MONGO_CONNECT=mongodb://username:password@hostname.foo.bar:27017/spotidrop-xxxx');

// wrapper to hold callback from test
const wrapper = {app: null, cb: null};
const storeApp = (app) => {
  wrapper.app = app;
  return app;
};

// Promise chain ensures DB is set up first, then app
MongooseService.connectToAppInstance(process.env.MONGO_CONNECT)
  // DB Setup complete. Safe to execute anything that creates Mongoose Models
  .then(() => initModels())
  .then(() => {
    return express()
      .use(cors())
      .use(cookieParser())
      .use(bodyParser.urlencoded({extended: true}))
      .use(bodyParser.json())
      .use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
        // cookie: { secure: true }
      }));
  })
  .then((app) => storeApp(app))
  //  Initialise user auth
  .then((app) => initAuth(app))
  //  Initialise routes
  .then((app) => initRoutes(app, __dirname))
  //  Start the server and Initialise WebSocket
  .then((app) => app.listen(process.env.PORT))
  .then((server) => initSocket(server))
  // Login to Spotify
  .then(() => spotifyService.login())
  .then(() => log.info(`Initialization complete! Hit me up on localhost:${process.env.PORT}!`))
  .then(() => _.attempt(wrapper.cb))
  .catch((err) => {
    log.error('FATAL app initialization error:\n', err, '\n', err.stack, '\nCan\'t recover! Ouch. Ugh. Dead.');
    throw ('Fatal. Exit!');
  })
  .done();

module.exports = wrapper;
