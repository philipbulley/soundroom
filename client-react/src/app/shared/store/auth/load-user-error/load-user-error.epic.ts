import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/ignoreElements';
import { StoreState } from '../../store-state';
import { Epic } from 'redux-observable';
import { LOAD_USER_ERROR } from './load-user-error.action';
import { removePersistedJwt } from '../../../auth/auth.service';

export const loadUserErrorEpic: Epic<any, StoreState> = (action$, store) => action$
  .filter(action => action.type === LOAD_USER_ERROR)
  .do(() => removePersistedJwt())
  .ignoreElements();
