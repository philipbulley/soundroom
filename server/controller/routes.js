import express from 'express';
import cors from 'cors';
import { join } from 'path';
import index from './route/index';
import playlists from './route/playlists';
import users from './route/users';
import me from './route/me';
import search from './route/search';
import track from './route/track';
import auth from './route/auth';

export default {
  index,
  playlists,
  users,
  me,
  search,
  auth
};

export function initRoutes(app, dirname) {
  app.use(cors());

  // Routes
  app.use('/api', index)
    .use('/api/playlists', playlists)
    .use('/api/users', users)
    .use('/api/me', me)
    .use('/api/search', search)
    .use('/api/track', track)
    .use('/auth', auth);

  // Serve static files for testing
  app.use('/static', express.static(join(dirname, 'static')));

  return app;

}
