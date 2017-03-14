import { ErrorResult } from '../../../model/error-result';

export interface LoadUserErrorResult extends ErrorResult {
  skipSignInRedirect: boolean;
}
