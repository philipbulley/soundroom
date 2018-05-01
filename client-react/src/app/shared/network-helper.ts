import { Auth } from './store/auth/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'whatwg-fetch';

export function createHeaders(auth: Auth) {
	const headers: { [header: string]: any } = {
		'Content-Type': 'application/json'
	};

	if (auth.jwt) {
		headers.Authorization = `JWT ${auth.jwt}`;
	}

	return headers;
}

export function fetchRx(
	input: RequestInfo,
	init?: RequestInit
): Observable<Response> {
	return Observable.fromPromise(fetch(input, init)).map(
		(response: Response) => {
			// Fetch doesn't throw erroneous responses, but prefer if all errors can be dealt with via catch
			if (response.ok) {
				return response;
			} else {
				throw response;
			}
		}
	);
}
