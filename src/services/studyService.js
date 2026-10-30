import api from './api.js';

// Unwrap the shared API response envelope for study requests.
async function getData(request) {
  const response = await request;
  return response.data.data;
}

export function getMaterials(params = {}) {
  return getData(api.get('/api/materials', { params }));
}

export async function downloadResource(id) {
  const result = await getData(api.post(`/api/materials/${encodeURIComponent(id)}/download`));
  const url = new URL(result.fileUrl, import.meta.env.VITE_API_URL || window.location.origin);
  window.location.assign(url.href);
  return `Downloading ${result.title || 'study material'}...`;
}

export function viewVideo(id) {
  return getData(api.post(`/api/materials/${encodeURIComponent(id)}/view`));
}

export function submitResourceRequest(request) {
  return getData(api.post('/api/resource-requests', request));
}

export function getResourceRequests() {
  return getData(api.get('/api/me/resource-requests'));
}

export default { getMaterials, downloadResource, viewVideo, submitResourceRequest, getResourceRequests };
