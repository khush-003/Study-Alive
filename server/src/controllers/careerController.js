import * as careerService from '../services/careerService.js';
import { sendSuccess } from '../utils/responses.js';

// Serve the career list using the frontend's name and required-skills search.
export async function list(request, response) {
  const careers = await careerService.getCareers({
    query: request.query.q || '',
    limit: request.query.limit ?? 50,
  });
  return sendSuccess(response, careers, 'Careers loaded.');
}

// Serve complete career details, including their normalized child records.
export async function getBySlug(request, response) {
  return sendSuccess(response, await careerService.getCareer(request.params.slug), 'Career loaded.');
}

// Return both full profiles in one response for side-by-side comparison.
export async function compare(request, response) {
  const result = await careerService.compareCareers(request.query.a, request.query.b);
  return sendSuccess(response, result, 'Careers loaded for comparison.');
}

// Serve curated trending careers in the frontend's existing order.
export async function trending(request, response) {
  return sendSuccess(response, await careerService.getTrendingCareers(), 'Trending careers loaded.');
}

// Save the requested career for the authenticated student.
export async function save(request, response) {
  const career = await careerService.saveCareer(request.user.id, request.params.id);
  return sendSuccess(response, career, 'Career saved.');
}

// Remove the requested career from the authenticated student's saved list.
export async function unsave(request, response) {
  await careerService.unsaveCareer(request.user.id, request.params.id);
  return sendSuccess(response, { id: request.params.id, saved: false }, 'Career removed from saved careers.');
}

// Return the authenticated student's saved career profiles.
export async function saved(request, response) {
  const careers = await careerService.getSavedCareers(request.user.id);
  return sendSuccess(response, careers, 'Saved careers loaded.');
}
