import { ErrorResult } from '../../../error/error-result';

export interface LoadUserErrorResult extends ErrorResult {
	skipSignInRedirect: boolean;
}
