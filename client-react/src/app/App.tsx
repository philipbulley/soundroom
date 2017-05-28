import * as React from 'react';
import { store, history } from './shared/store/store';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router, push } from 'react-router-redux';
import { Route } from 'react-router';

const onClick = (path: string) => {
  store.dispatch(push(path));
};

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route exact path="/" render={() => <h2>home route: <a onClick={(e) => onClick('/test1')}>Go to 1</a></h2>}/>
        <Route exact path="/test1" render={() => <h2>test one route: <a onClick={(e) => onClick('/test2')}>Go to 2</a></h2>}/>
        <Route exact path="/test2" render={() => <h2>test two route: <a onClick={(e) => onClick('/')}>Go Home</a></h2>}/>
      </div>
    </Router>
  </Provider>
);

export default App;
