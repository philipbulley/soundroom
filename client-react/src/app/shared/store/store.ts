import { createStore, combineReducers, applyMiddleware } from 'redux';
import { combineEpics } from 'redux-observable';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { StoreState } from './store-state';
import { playlistsReducer } from './playlists/playlists.reducer';
import { authReducer } from './auth/auth.reducer';
import { authEpics } from './auth/auth-epics';
import { playlistsEpics } from './playlists/playlists-epics';

const reducers = {
	playlists: playlistsReducer,
	auth: authReducer
};

const rootReducer = combineReducers<StoreState>({
	...reducers,
	router: routerReducer
});

export const rootEpic = combineEpics(...authEpics, ...playlistsEpics);
// TODO(redux-observable): use dependencies when fixed https://github.com/redux-observable/redux-observable/issues/231
const epicMiddleware = createEpicMiddleware(rootEpic /*, {
  dependencies: {
    ajax
  }
}*/);

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const routerMiddleware = createRouterMiddleware(history);

export const store = createStore<StoreState>(
	rootReducer,
	composeWithDevTools(applyMiddleware(routerMiddleware, epicMiddleware))
);
