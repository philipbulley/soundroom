import * as fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
import { loadUserEpic, PATH } from './load-user.epic';
import { Config } from '../../../model/config';
import { MOCK_USER } from '../../../model/user/user.mock';
import loadUserAction from './load-user.action';
import loadUserSuccessAction from '../load-user-success/load-user-success.action';
import { StoreState } from '../../store-state';
import { AuthStatus } from '../auth-state';
import loadUserErrorAction from '../load-user-error/load-user-error.action';
import { ErrorType } from '../../../error/error-type';

const epicMiddleware = createEpicMiddleware(loadUserEpic);
const mockStore = configureMockStore([epicMiddleware]);

describe('loadUserEpic', () => {
	let store;

	const MOCK_STATE: Partial<StoreState> = {
		auth: {
			status: AuthStatus.LOGGED_OUT,
			user: null,
			jwt: 'mock-jwt'
		}
	};

	const MOCK_STATE_WITHOUT_JWT: Partial<StoreState> = {
		auth: {
			status: AuthStatus.LOGGED_OUT,
			user: null,
			jwt: null
		}
	};

	afterEach(() => {
		fetchMock.restore();
		epicMiddleware.replaceEpic(loadUserEpic);
	});

	it('should dispatch a success action', done => {
		store = mockStore(MOCK_STATE);
		fetchMock.get(Config.API_BASE_URL + PATH, {
			status: 200,
			body: JSON.stringify(MOCK_USER)
		});

		store.dispatch(loadUserAction());
		expect.assertions(1);

		setTimeout(() => {
			expect(store.getActions()).toEqual([loadUserAction(), loadUserSuccessAction(MOCK_USER)]);
			done();
		}, 0);
	});

	it('should dispatch an error action if no JWT in store', () => {
		store = mockStore(MOCK_STATE_WITHOUT_JWT);
		store.dispatch(loadUserAction());

		expect(store.getActions()).toEqual([
			loadUserAction(),
			loadUserErrorAction({
				type: ErrorType.UNKNOWN,
				skipSignInRedirect: false,
				status: 0,
				message: 'No cached JWT'
			})
		]);
	});

	it('should dispatch an error action if user is unauthorized', done => {
		store = mockStore(MOCK_STATE);
		fetchMock.get(Config.API_BASE_URL + PATH, {
			status: 401,
			body: 'Unauthorized'
		});

		store.dispatch(loadUserAction());
		expect.assertions(1);

		setTimeout(() => {
			expect(store.getActions()).toEqual([
				loadUserAction(),
				loadUserErrorAction({
					type: ErrorType.UNKNOWN,
					skipSignInRedirect: false,
					status: 0,
					message: 'Unable to load user'
				})
			]);
			done();
		}, 0);
	});
});
