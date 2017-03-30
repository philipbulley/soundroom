import { ErrorResult } from '../../../model/error/error-result';

export interface LoadUserErrorResult extends ErrorResult {
  skipSignInRedirect: boolean;
}
