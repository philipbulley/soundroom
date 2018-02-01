import { Auth } from '../auth';
import { AuthStatus } from '../auth-state';
import { loadUserCommand } from './load-user.command';
import { ErrorResult } from '../../../error/error-result';
import { ErrorType } from '../../../error/error-type';
import deepFreeze = require('deep-freeze');

describe('loadUserCommand', () => {
  const MOCK_JWT = 'abcdefghijklmnop123';
  const ERROR_RESULT: ErrorResult = {
    status: 404,
    message: 'Not found',
    type: ErrorType.UNKNOWN,
  };
  let authState: Auth;

  beforeEach(() => {
    authState = deepFreeze({
      status: AuthStatus.LOGGED_OUT,
      user: null,
      jwt: null,
    });
  });

  it('should set status to loading', () => {
    authState = loadUserCommand(authState, {});
    expect(authState.status).toBe(AuthStatus.LOADING);
  });

  it('should accept payload without a JWT', () => {
    authState = loadUserCommand(authState, {});
    expect(authState.jwt).toBeFalsy();
  });

  it('should add JWT if present in payload', () => {
    authState = loadUserCommand(authState, {jwt: MOCK_JWT});
    expect(authState.jwt).toBe(MOCK_JWT);
  });

  it('should remove any previous error', () => {
    // Add an error to state
    authState = {...authState, error: ERROR_RESULT};
    authState = loadUserCommand(authState, {});
    expect(authState.error).toBeUndefined();
  });
});
