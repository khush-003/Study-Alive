import * as communityModel from '../models/communityModel.js';
import ApiError from '../utils/ApiError.js';

// Search skills and names while excluding the current user's own offers.
export function getPeers(query = '', userId = null) {
  return communityModel.listPeers({ query: query.trim(), excludeUserId: userId });
}

// Create the current student's offer, returning an existing identical offer if repeated.
export async function publishSkillOffer(userId, values) {
  try {
    const id = await communityModel.createSkillOffer(userId, values);
    return { id, userId, ...values };
  } catch (error) {
    if (error.code !== 'ER_DUP_ENTRY') throw error;
    const existing = await communityModel.findSkillOffer(userId, values);
    if (!existing) throw error;
    return existing;
  }
}

// Toggle a connection to another existing user without allowing self-connections.
export async function toggleConnection(userId, targetUserId) {
  if (String(userId) === String(targetUserId)) {
    throw new ApiError(400, 'You cannot connect with your own account.');
  }

  const result = await communityModel.toggleConnection(userId, targetUserId);
  if (result.reason === 'user-not-found') throw new ApiError(404, 'Student was not found.');
  return { userId: targetUserId, connected: result.connected };
}

// List all connected peer profiles for the signed-in student.
export function getConnections(userId) {
  return communityModel.listConnections(userId);
}

// Return the signed-in student's own offers for the Community page.
export function getUserSkillOffers(userId) {
  return communityModel.listUserSkillOffers(userId);
}

// Return only future sessions and personalize the reservation flag when signed in.
export function getSessions(userId = null) {
  return communityModel.listUpcomingSessions(userId);
}

// Reserve an upcoming session and return the resulting state.
export async function reserveSession(userId, sessionId) {
  const reserved = await communityModel.reserveSession(userId, sessionId);
  if (!reserved) throw new ApiError(404, 'Upcoming session was not found.');
  return { sessionId: Number(sessionId), reserved: true };
}

// Cancel a reservation for an existing session, including sessions no longer upcoming.
export async function cancelSessionReservation(userId, sessionId) {
  const exists = await communityModel.cancelSessionReservation(userId, sessionId);
  if (!exists) throw new ApiError(404, 'Session was not found.');
  return { sessionId: Number(sessionId), reserved: false };
}
