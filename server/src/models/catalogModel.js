import pool from '../config/db.js';

// Convert driver JSON values consistently whether MySQL returns parsed arrays or strings.
function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Keep normalized career children in the object shape the existing pages expect.
function mapCareer(row) {
  return {
    ...row,
    degreePaths: parseJsonArray(row.degreePaths),
    pros: parseJsonArray(row.pros),
    risks: parseJsonArray(row.risks),
    jobProfiles: parseJsonArray(row.jobProfiles),
  };
}

// Read career cards with optional search text bound as a SQL value.
export async function listCareers(search) {
  const term = `%${search}%`;
  const [rows] = await pool.execute(
    `SELECT c.slug AS id, c.category, c.name, c.tagline, c.about, c.icon, c.scope,
      c.salary_range AS averageSalary, c.job_opportunities AS jobOpportunities,
      c.future_growth AS futureGrowth, c.required_skills AS requiredSkills,
      c.global_opportunities AS globalOpportunities, c.best_for AS bestFor,
      (SELECT JSON_ARRAYAGG(d.degree_path) FROM career_degrees d WHERE d.career_id = c.id) AS degreePaths,
      (SELECT JSON_ARRAYAGG(p.description) FROM career_pros_cons p WHERE p.career_id = c.id AND p.item_type = 'pro') AS pros,
      (SELECT JSON_ARRAYAGG(r.description) FROM career_pros_cons r WHERE r.career_id = c.id AND r.item_type = 'risk') AS risks,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('title', j.title, 'stack', j.stack, 'salary', j.salary_range))
       FROM career_jobs j WHERE j.career_id = c.id) AS jobProfiles
     FROM careers c
     WHERE (? = '' OR c.name LIKE ? OR c.category LIKE ?)
     ORDER BY c.name`,
    [search, term, term],
  );
  return rows.map(mapCareer);
}

// Find one career by its public string id.
export async function findCareer(slug) {
  const [rows] = await pool.execute(
    `SELECT c.slug AS id, c.category, c.name, c.tagline, c.about, c.icon, c.scope,
      c.salary_range AS averageSalary, c.job_opportunities AS jobOpportunities,
      c.future_growth AS futureGrowth, c.required_skills AS requiredSkills,
      c.global_opportunities AS globalOpportunities, c.best_for AS bestFor,
      (SELECT JSON_ARRAYAGG(d.degree_path) FROM career_degrees d WHERE d.career_id = c.id) AS degreePaths,
      (SELECT JSON_ARRAYAGG(p.description) FROM career_pros_cons p WHERE p.career_id = c.id AND p.item_type = 'pro') AS pros,
      (SELECT JSON_ARRAYAGG(r.description) FROM career_pros_cons r WHERE r.career_id = c.id AND r.item_type = 'risk') AS risks,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('title', j.title, 'stack', j.stack, 'salary', j.salary_range))
       FROM career_jobs j WHERE j.career_id = c.id) AS jobProfiles
     FROM careers c WHERE c.slug = ? LIMIT 1`,
    [slug],
  );
  return rows[0] ? mapCareer(rows[0]) : null;
}

// Return study resources filtered by optional subject and resource type.
export async function listStudyMaterials({ subject, type }) {
  const [rows] = await pool.execute(
    `SELECT id, subject, type, title, description AS meta,
      COALESCE(file_url, '') AS filename, size_mb AS sizeMb, duration
     FROM study_materials
     WHERE (? = '' OR subject = ?) AND (? = '' OR type = ?)
     ORDER BY title`,
    [subject, subject, type, type],
  );
  return rows;
}

// Return peers whose profile text matches the optional search query.
export async function listPeers(search) {
  const term = `%${search}%`;
  const [rows] = await pool.execute(
    `SELECT o.id, u.name, u.avatar_url AS avatar, o.teach_skill AS teaches,
      o.learn_skill AS wantsToLearn
     FROM skill_offers o
     INNER JOIN users u ON u.id = o.user_id
     WHERE (? = '' OR u.name LIKE ? OR o.teach_skill LIKE ? OR o.learn_skill LIKE ?)
     ORDER BY o.created_at DESC, u.name`,
    [search, term, term, term],
  );
  return rows;
}

// Return scheduled peer learning sessions in chronological order.
export async function listSessions() {
  const [rows] = await pool.execute(
    `SELECT id, badge, DATE_FORMAT(starts_at, '%W %h:%i %p') AS time, title, speaker
     FROM live_sessions
     ORDER BY starts_at`,
  );
  return rows;
}

// Return current platform news, with a known category filter when provided.
export async function listUpdates(category) {
  const [rows] = await pool.execute(
    `SELECT id, category, category AS label,
      CASE
        WHEN TIMESTAMPDIFF(MINUTE, published_at, CURRENT_TIMESTAMP) < 60
          THEN CONCAT(TIMESTAMPDIFF(MINUTE, published_at, CURRENT_TIMESTAMP), ' minutes ago')
        WHEN TIMESTAMPDIFF(HOUR, published_at, CURRENT_TIMESTAMP) < 24
          THEN CONCAT(TIMESTAMPDIFF(HOUR, published_at, CURRENT_TIMESTAMP), ' hours ago')
        ELSE CONCAT(TIMESTAMPDIFF(DAY, published_at, CURRENT_TIMESTAMP), ' days ago')
      END AS timeAgo,
      title, summary, details
     FROM \`updates\`
     WHERE (? = '' OR category = ?)
     ORDER BY published_at DESC`,
    [category, category],
  );
  return rows;
}
