import * as React from 'react';
import { store, history } from './shared/store/store';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import { Route } from 'react-router';
import Rooms from './rooms/rooms';
import Room from './room/room';
import SignIn from './sign-in/sign-in';

// const onClick = (path: string) => {
//   store.dispatch(push(path));
// };

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route exact={true} path="/" component={Rooms}/>
        <Route path="/sign-in" component={SignIn}/>
        <Route path="/room/:id" component={Room}/>
      </div>
    </Router>
  </Provider>
);

export default App;
