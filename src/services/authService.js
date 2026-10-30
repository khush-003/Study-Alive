import api from './api.js';

// Return the standard API envelope payload for the requested authentication action.
async function authRequest(request) {
  try {
    const response = await request;
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Unable to authenticate with the server.');
  }
}

export function registerAccount(details) {
  return authRequest(api.post('/api/auth/register', details));
}

export function loginAccount(details) {
  return authRequest(api.post('/api/auth/login', details));
}

export function loginDemoAccount(profile) {
  return authRequest(api.post('/api/auth/demo-login', { profile }));
}

export async function fetchCurrentUser() {
  return authRequest(api.get('/api/auth/me'));
}

export async function updateAccount(details) {
  return authRequest(api.put('/api/auth/me', details));
}
