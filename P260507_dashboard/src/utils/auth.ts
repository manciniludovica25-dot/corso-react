const AUTH_KEY = 'admin_auth_token';
const FAKE_TOKEN = 'token_super_segreto';

export function effettuaLogin(username: string, password: string): boolean {
  if (username === 'admin' && password === 'admin') {
    localStorage.setItem(AUTH_KEY, FAKE_TOKEN);
    return true;
  }
  return false;
}

export function èAutenticato(): boolean {
  return localStorage.getItem(AUTH_KEY) === FAKE_TOKEN;
}

export function effettuaLogout(): void {
  localStorage.removeItem(AUTH_KEY);
}