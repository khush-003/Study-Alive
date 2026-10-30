import { sendSuccess } from '../utils/responses.js';
import * as geminiService from '../services/geminiService.js';

// Generate counselor guidance using the authenticated user's server-loaded profile.
export async function ask(request, response) {
  const result = await geminiService.askCounselor(request.user, request.body);
  return sendSuccess(response, result, 'AI response generated.');
}

// Generate a comparison without accepting system instructions from the client.
export async function compare(request, response) {
  const result = await geminiService.compareCareers(request.user, request.body);
  return sendSuccess(response, result, 'Career comparison generated.');
}

// Generate a study kit with a server-selected prompt for the requested kit type.
export async function studyKit(request, response) {
  const result = await geminiService.createStudyKit(request.user, request.body);
  return sendSuccess(response, result, 'Study kit generated.');
}
