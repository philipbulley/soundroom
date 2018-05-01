import { AuthStatus } from './auth-state';
import { ErrorResult } from '../../error/error-result';
import { User } from '../../model/user/user';

export interface Auth {
	status: AuthStatus;
	user: User | null;
	jwt: string | null;
	error?: ErrorResult;
}
