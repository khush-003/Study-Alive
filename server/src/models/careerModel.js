import pool from '../config/db.js';

// Map database career columns to the same camelCase profile fields as careers.js.
function mapCareer(row) {
  return {
    databaseId: row.databaseId,
    id: row.slug,
    category: row.category,
    name: row.name,
    tagline: row.tagline,
    about: row.about,
    icon: row.icon,
    scope: row.scope,
    averageSalary: row.salary_range,
    jobOpportunities: row.job_opportunities,
    futureGrowth: row.future_growth,
    requiredSkills: row.required_skills,
    globalOpportunities: row.global_opportunities,
    bestFor: row.best_for,
    degreePaths: [],
    pros: [],
    risks: [],
    jobProfiles: [],
  };
}

// Fill each career's child arrays in one query per related table, avoiding N+1 reads.
async function attachCareerDetails(careers) {
  if (!careers.length) return careers;

  const careerIds = careers.map((career) => career.databaseId);
  const placeholders = careerIds.map(() => '?').join(', ');
  const [degreeRows] = await pool.execute(
    `SELECT career_id, degree_path FROM career_degrees
     WHERE career_id IN (${placeholders}) ORDER BY career_id, sort_order`,
    careerIds,
  );
  const [proConRows] = await pool.execute(
    `SELECT career_id, item_type, description FROM career_pros_cons
     WHERE career_id IN (${placeholders}) ORDER BY career_id, item_type, sort_order`,
    careerIds,
  );
  const [jobRows] = await pool.execute(
    `SELECT career_id, title, stack, salary_range FROM career_jobs
     WHERE career_id IN (${placeholders}) ORDER BY career_id, sort_order`,
    careerIds,
  );

  const byDatabaseId = new Map(careers.map((career) => [String(career.databaseId), career]));
  for (const row of degreeRows) {
    byDatabaseId.get(String(row.career_id))?.degreePaths.push(row.degree_path);
  }
  for (const row of proConRows) {
    const career = byDatabaseId.get(String(row.career_id));
    if (career) career[row.item_type === 'pro' ? 'pros' : 'risks'].push(row.description);
  }
  for (const row of jobRows) {
    byDatabaseId.get(String(row.career_id))?.jobProfiles.push({
      title: row.title,
      stack: row.stack,
      salary: row.salary_range,
    });
  }

  return careers.map(({ databaseId, ...career }) => career);
}

// Read career summary fields using optional search and limit values as bound parameters.
export async function listCareers({ query, limit }) {
  const searchTerm = `%${query}%`;
  const [rows] = await pool.execute(
    `SELECT c.id AS databaseId, c.slug, c.category, c.name, c.tagline, c.about,
      c.icon, c.scope, c.salary_range, c.job_opportunities, c.future_growth,
      c.required_skills, c.global_opportunities, c.best_for
     FROM careers c
     WHERE (? = '' OR c.name LIKE ? OR c.required_skills LIKE ?)
     ORDER BY c.name
     LIMIT ?`,
    [query, searchTerm, searchTerm, limit],
  );
  return attachCareerDetails(rows.map(mapCareer));
}

// Find one complete career by its public slug.
export async function findCareerBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT c.id AS databaseId, c.slug, c.category, c.name, c.tagline, c.about,
      c.icon, c.scope, c.salary_range, c.job_opportunities, c.future_growth,
      c.required_skills, c.global_opportunities, c.best_for
     FROM careers c WHERE c.slug = ? LIMIT 1`,
    [slug],
  );
  if (!rows.length) return null;
  const careers = await attachCareerDetails(rows.map(mapCareer));
  return careers[0];
}

// Return the complete career profiles for a curated list of trending slugs.
export async function listTrendingCareers(slugs) {
  const placeholders = slugs.map(() => '?').join(', ');
  const [rows] = await pool.execute(
    `SELECT c.id AS databaseId, c.slug, c.category, c.name, c.tagline, c.about,
      c.icon, c.scope, c.salary_range, c.job_opportunities, c.future_growth,
      c.required_skills, c.global_opportunities, c.best_for
     FROM careers c WHERE c.slug IN (${placeholders})`,
    slugs,
  );
  const order = new Map(slugs.map((slug, index) => [slug, index]));
  rows.sort((a, b) => order.get(a.slug) - order.get(b.slug));
  return attachCareerDetails(rows.map(mapCareer));
}

// Read the internal career identifier needed by the user-career join table.
export async function findCareerDatabaseId(slug) {
  const [rows] = await pool.execute('SELECT id FROM careers WHERE slug = ? LIMIT 1', [slug]);
  return rows[0]?.id ?? null;
}

// Save a career once; the composite key makes repeated requests idempotent.
export async function insertSavedCareer(userId, careerId) {
  await pool.execute(
    'INSERT IGNORE INTO saved_careers (user_id, career_id) VALUES (?, ?)',
    [userId, careerId],
  );
}

// Remove a student's saved-career relationship.
export async function deleteSavedCareer(userId, careerId) {
  const [result] = await pool.execute(
    'DELETE FROM saved_careers WHERE user_id = ? AND career_id = ?',
    [userId, careerId],
  );
  return result.affectedRows > 0;
}

// Load every saved career in the same profile shape as the public career list.
export async function listSavedCareers(userId) {
  const [rows] = await pool.execute(
    `SELECT c.id AS databaseId, c.slug, c.category, c.name, c.tagline, c.about,
      c.icon, c.scope, c.salary_range, c.job_opportunities, c.future_growth,
      c.required_skills, c.global_opportunities, c.best_for
     FROM saved_careers s
     INNER JOIN careers c ON c.id = s.career_id
     WHERE s.user_id = ?
     ORDER BY s.saved_at DESC`,
    [userId],
  );
  return attachCareerDetails(rows.map(mapCareer));
}
