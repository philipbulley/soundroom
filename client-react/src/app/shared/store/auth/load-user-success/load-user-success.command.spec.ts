import { Auth } from '../auth';
import { AuthStatus } from '../auth-state';
import { loadUserSuccessCommand } from './load-user-success.command';
import { MOCK_USER } from '../../../model/user/user.mock';
import deepFreeze = require('deep-freeze');

describe('loadUserSuccessCommand', () => {
  let authState: Auth;

  beforeEach(() => {
    authState = deepFreeze({
      status: AuthStatus.LOADING,
      user: null,
      jwt: null,
    });
  });

  it('should set status to logged in', () => {
    authState = loadUserSuccessCommand(authState, MOCK_USER);
    expect(authState.status).toBe(AuthStatus.LOGGED_IN);
  });

  it('should not contain an error', () => {
    authState = loadUserSuccessCommand(authState, MOCK_USER);
    expect(authState.error).toBeUndefined();
  });
});
