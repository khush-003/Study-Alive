import { getProfileCounts } from '../models/profileStatsModel.js';
import { getEarnedBadges } from './badgeService.js';

// Combine SQL activity counts and rule-based earned badges for the Profile page.
export async function getStudentStats(userId) {
  const counts = await getProfileCounts(userId);
  return {
    saved: counts.saved,
    courses: counts.courses,
    connections: counts.connections,
    badges: getEarnedBadges(counts),
  };
}
