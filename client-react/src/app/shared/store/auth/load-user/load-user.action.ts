export const LOAD_USER = 'LOAD_USER';
export type LOAD_USER = typeof LOAD_USER;

export interface LoadUser {
  type: LOAD_USER;
  jwt: string;

  // TODO(client-react): Implement or remove
  skipSignInRedirectOnError?: boolean;
}

const loadUserAction = (jwt): LoadUser => ({
  type: LOAD_USER,
  jwt,
});

export default loadUserAction;
