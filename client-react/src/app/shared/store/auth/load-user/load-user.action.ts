export const LOAD_USER = 'LOAD_USER';
export type LOAD_USER = typeof LOAD_USER;

export interface LoadUserAction {
  type: LOAD_USER;
  payload: LoadUserParams;
}

export interface LoadUserParams {
  jwt: string;

  // TODO(client-react): Implement or remove
  skipSignInRedirectOnError?: boolean;
}

const loadUserAction = (jwt): LoadUserAction => ({
  type: LOAD_USER,
  payload: {
    jwt,
  },
});

export default loadUserAction;
