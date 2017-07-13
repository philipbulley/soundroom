import { LOAD_USER_SUCCESS } from './load-user-success.action';
import 'rxjs/add/operator/mapTo';
import { StoreState } from '../../store-state';
import { Epic } from 'redux-observable';
import { push } from 'react-router-redux';

export const loadUserSuccessEpic: Epic<any, StoreState> = (action$, store) => action$
  .filter(action => action.type === LOAD_USER_SUCCESS)
  // Redirect to the root of the app
  .mapTo(push('/'));
