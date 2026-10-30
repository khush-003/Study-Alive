import api from './api.js';

// Read one page or record from the shared updates endpoint.
async function getData(request) {
  const response = await request;
  return response.data.data;
}

export function getUpdates(params = {}) {
  return getData(api.get('/api/updates', { params }));
}

export function getUpdate(id) {
  return getData(api.get(`/api/updates/${encodeURIComponent(id)}`));
}

export default { getUpdates, getUpdate };
