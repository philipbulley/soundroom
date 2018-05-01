import 'rxjs/add/operator/mapTo';
import { StoreState } from '../../store-state';
import { Epic } from 'redux-observable';
import { replace } from 'react-router-redux';
import { PlaylistsActionType } from '../../playlists/playlists-action-type';

export const loadUserSuccessEpic: Epic<any, StoreState> = (action$, store) =>
	action$
		.filter(action => action.type === PlaylistsActionType.LOAD_SUCCESS)
		// Redirect to the root of the app
		.mapTo(replace('/'));
