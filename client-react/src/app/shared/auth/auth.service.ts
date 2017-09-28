const JWT_STORAGE_KEY: string = 'soundroom.auth.jwt';

export function getPersistedJwt() {
  return localStorage.getItem(JWT_STORAGE_KEY);
}

export function setPersistedJwt(jwt: string) {
  localStorage.setItem(JWT_STORAGE_KEY, jwt);
}

export function removePersistedJwt() {
  localStorage.removeItem(JWT_STORAGE_KEY);
}
