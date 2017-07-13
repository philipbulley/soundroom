import * as React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router';
import Rooms from './../rooms/rooms';
import Room from './../room/room';
import SignIn from './../sign-in/sign-in';
import AuthRoute from '../shared/router/auth-route';
import NoAuthRoute from '../shared/router/no-auth-route';
import { history } from '../shared/store/store';
import AppToolbar from './../app-toolbar/app-toolbar';

const Routes = () => (
  <ConnectedRouter history={history}>
    <div>
      <Route path="/" component={AppToolbar}/>
      <Switch>
        <AuthRoute exact={true} path="/" component={Rooms}/>
        <NoAuthRoute path="/sign-in" component={SignIn}/>
        <AuthRoute path="/room/:id" component={Room}/>
        <Route render={() => <h1>404 mate.</h1>}/>
      </Switch>
    </div>
  </ConnectedRouter>
);

export default Routes;
