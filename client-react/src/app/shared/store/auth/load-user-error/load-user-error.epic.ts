import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/ignoreElements';
import { StoreState } from '../../store-state';
import { Epic } from 'redux-observable';
import { removePersistedJwt } from '../../../auth/auth.service';
import { AuthActionType } from '../auth-action-types';

export const loadUserErrorEpic: Epic<any, StoreState> = (action$, store) => action$
  .filter(action => action.type === AuthActionType.LOAD_USER_ERROR)
  .do(() => removePersistedJwt())
  .ignoreElements();
