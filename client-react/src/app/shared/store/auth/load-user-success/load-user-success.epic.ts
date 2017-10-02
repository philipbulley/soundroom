import 'rxjs/add/operator/mapTo';
import { StoreState } from '../../store-state';
import { Epic } from 'redux-observable';
import { replace } from 'react-router-redux';
import { PlaylistCollectionActionType } from '../../playlist-collection/playlist-collection-action-types';

export const loadUserSuccessEpic: Epic<any, StoreState> = (action$, store) => action$
  .filter(action => action.type === PlaylistCollectionActionType.LOAD_SUCCESS)
  // Redirect to the root of the app
  .mapTo(replace('/'));
