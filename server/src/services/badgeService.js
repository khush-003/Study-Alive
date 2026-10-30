// Build earned profile badges from database-derived student activity counts.
export function getEarnedBadges({ saved, connections, downloads }) {
  const badges = [];
  if (connections >= 1) {
    badges.push({
      id: 'first-connection',
      name: 'First Connection',
      description: 'Connected with a fellow learner.',
    });
  }
  if (downloads >= 3) {
    badges.push({
      id: 'resource-explorer',
      name: 'Resource Explorer',
      description: 'Downloaded at least three study resources.',
    });
  }
  if (saved >= 1) {
    badges.push({
      id: 'career-curator',
      name: 'Career Curator',
      description: 'Saved your first career.',
    });
  }
  return badges;
}
