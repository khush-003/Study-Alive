import * as communityService from '../services/communityService.js';
import { sendCreated, sendSuccess } from '../utils/responses.js';

// Serve the peer directory with optional search and current-user exclusion.
export async function peers(request, response) {
  const results = await communityService.getPeers(request.query.q, request.user?.id);
  return sendSuccess(response, results, 'Peer offers loaded.');
}

// Publish a skill offer for the authenticated student.
export async function createOffer(request, response) {
  const offer = await communityService.publishSkillOffer(request.user.id, request.body);
  return sendCreated(response, offer, 'Skill offer published.');
}

// Toggle the signed-in student's connection to the selected peer.
export async function toggleConnection(request, response) {
  const result = await communityService.toggleConnection(request.user.id, request.params.userId);
  const message = result.connected ? 'Connected with student.' : 'Connection removed.';
  return sendSuccess(response, result, message);
}

// Return the signed-in student's connections.
export async function connections(request, response) {
  return sendSuccess(
    response,
    await communityService.getConnections(request.user.id),
    'Connections loaded.',
  );
}

// Serve the authenticated student's own offers for their personal list.
export async function myOffers(request, response) {
  return sendSuccess(
    response,
    await communityService.getUserSkillOffers(request.user.id),
    'Your skill offers loaded.',
  );
}

// Serve upcoming sessions with reservation flags personalized to optional auth.
export async function sessions(request, response) {
  return sendSuccess(
    response,
    await communityService.getSessions(request.user?.id),
    'Upcoming sessions loaded.',
  );
}

// Reserve an upcoming session for the authenticated student.
export async function reserveSession(request, response) {
  const result = await communityService.reserveSession(request.user.id, request.params.id);
  return sendSuccess(response, result, 'Session reserved.');
}

// Remove the authenticated student's session reservation.
export async function cancelReservation(request, response) {
  const result = await communityService.cancelSessionReservation(request.user.id, request.params.id);
  return sendSuccess(response, result, 'Session reservation cancelled.');
}
