import { AuthStatus } from './auth-state';
import { ErrorResult } from '../../model/error/error-result';
import { User } from '../../model/user';

export interface Auth {
  status: AuthStatus;
  user: User | null;
  jwt: string | null;
  error?: ErrorResult;
}
