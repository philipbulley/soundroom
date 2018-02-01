import { Auth } from '../auth';
import { AuthStatus } from '../auth-state';
import { loadUserErrorCommand } from './load-user-error.command';
import { LoadUserErrorResult } from './load-user-error-result';
import { ErrorType } from '../../../error/error-type';
import deepFreeze = require('deep-freeze');

describe('loadUserErrorCommand', () => {
  const ERROR_RESULT: LoadUserErrorResult = {
    status: 404,
    message: 'Not found',
    type: ErrorType.UNKNOWN,
    skipSignInRedirect: false,
  };
  let authState: Auth;

  beforeEach(() => {
    authState = deepFreeze({
      status: AuthStatus.LOADING,
      user: null,
      jwt: null,
    });
  });

  it('should set status to loading', () => {
    authState = loadUserErrorCommand(authState, ERROR_RESULT);
    expect(authState.status).toBe(AuthStatus.LOGGED_OUT);
  });

  it('should add the error to state', () => {
    authState = loadUserErrorCommand(authState, ERROR_RESULT);
    expect(authState.error).toBe(ERROR_RESULT);
  });
});
