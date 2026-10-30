import * as catalogService from '../services/catalogService.js';
import { sendSuccess } from '../utils/responses.js';

// Serve the catalog datasets used by the Explore and Home pages.
export async function getCareers(request, response) {
  return sendSuccess(response, await catalogService.getCareers(request.query.search));
}

// Serve one career for the route selected in Explore.
export async function getCareer(request, response) {
  return sendSuccess(response, await catalogService.getCareer(request.params.id));
}

// Serve study resources filtered by subject and resource type.
export async function getStudyMaterials(request, response) {
  const materials = await catalogService.getStudyMaterials({
    subject: request.query.subject,
    type: request.query.type,
  });
  return sendSuccess(response, materials);
}

// Serve public peer cards for the Community page.
export async function getPeers(request, response) {
  return sendSuccess(response, await catalogService.getPeers(request.query.search));
}

// Serve future live sessions for the Community page.
export async function getSessions(request, response) {
  return sendSuccess(response, await catalogService.getSessions());
}

// Serve updates, optionally filtered to one supported category.
export async function getUpdates(request, response) {
  return sendSuccess(response, await catalogService.getUpdates(request.query.category));
}
