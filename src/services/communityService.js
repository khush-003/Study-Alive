import api from './api.js';

// Unwrap the shared API response envelope for community requests.
async function getData(request) {
  const response = await request;
  return response.data.data;
}

export function getPeers(params = {}) {
  return getData(api.get('/api/peers', { params }));
}

export function publishSkillOffer(offer) {
  return getData(api.post('/api/skill-offers', { teach: offer.teaches, learn: offer.wantsToLearn }));
}

export function toggleConnection(userId) {
  return getData(api.post(`/api/connections/${encodeURIComponent(userId)}`));
}

export function getConnections() {
  return getData(api.get('/api/me/connections'));
}

export function getMySkillOffers() {
  return getData(api.get('/api/me/skill-offers'));
}

export function getSessions() {
  return getData(api.get('/api/sessions'));
}

export function reserveSession(id) {
  return getData(api.post(`/api/sessions/${encodeURIComponent(id)}/reserve`));
}

export function cancelSessionReservation(id) {
  return getData(api.delete(`/api/sessions/${encodeURIComponent(id)}/reserve`));
}

export default { getPeers, publishSkillOffer, toggleConnection, getConnections, getMySkillOffers, getSessions, reserveSession, cancelSessionReservation };
