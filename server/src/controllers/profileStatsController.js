import { getStudentStats } from '../services/profileStatsService.js';
import { sendSuccess } from '../utils/responses.js';

// Return current saved, course, connection, and earned badge totals.
export async function getStats(request, response) {
  const stats = await getStudentStats(request.user.id);
  return sendSuccess(response, stats, 'Profile stats loaded.');
}
