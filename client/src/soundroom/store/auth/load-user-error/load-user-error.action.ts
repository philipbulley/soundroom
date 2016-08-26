import { Action } from '@ngrx/store';
import { ErrorResult } from "../../../model/error-result";

export class LoadUserErrorAction implements Action {
	// tslint:disable-next-line:no-reserved-keywords
	type: string = 'LoginErrorAction';

	constructor(public payload?: ErrorResult) {
		console.log('LoginErrorAction()', payload);
	}

}
