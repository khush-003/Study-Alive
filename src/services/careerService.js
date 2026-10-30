import api from './api.js';

// Read the backend response envelope once for all career endpoints.
async function getData(request) {
  const response = await request;
  return response.data.data;
}

export function getCareers(params = {}) {
  return getData(api.get('/api/careers', { params }));
}

export function getCareer(slug) {
  return getData(api.get(`/api/careers/${encodeURIComponent(slug)}`));
}

export function compareCareers(careerA, careerB) {
  return getData(api.get('/api/careers/compare', { params: { a: careerA, b: careerB } }));
}

export function getTrendingCareers() {
  return getData(api.get('/api/careers/trending'));
}

export function saveCareer(slug) {
  return getData(api.post(`/api/careers/${encodeURIComponent(slug)}/save`));
}

export function removeSavedCareer(slug) {
  return getData(api.delete(`/api/careers/${encodeURIComponent(slug)}/save`));
}

export function getSavedCareers() {
  return getData(api.get('/api/me/saved-careers'));
}

export default { getCareers, getCareer, compareCareers, getTrendingCareers, saveCareer, removeSavedCareer, getSavedCareers };
