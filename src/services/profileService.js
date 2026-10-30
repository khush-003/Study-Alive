import api from './api.js';

// Load the current student's SQL-computed profile totals and badges.
export async function getProfileStats() {
  const response = await api.get('/api/me/stats');
  return response.data.data;
}

export default { getProfileStats };
