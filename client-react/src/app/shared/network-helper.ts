import { Auth } from './store/auth/auth';

export function createHeaders(auth: Auth) {
  const headers: { [header: string]: any } = {
    'Content-Type': 'application/json',
  };

  if (auth.jwt) {
    headers.Authorization = `JWT ${auth.jwt}`;
  }

  return headers;
}
