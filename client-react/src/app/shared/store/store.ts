import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createHistory from 'history/createBrowserHistory';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { StoreState } from './store-state';

const reducers = {};

const rootReducer = combineReducers({
  ...reducers,
  router: routerReducer,
});

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

export const store = createStore<StoreState>(rootReducer, composeWithDevTools(
  applyMiddleware(middleware)
));
