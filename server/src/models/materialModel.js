import pool from '../config/db.js';

// Find one material with the same metadata fields consumed by the Study page.
export async function findMaterialById(id) {
  const [rows] = await pool.execute(
    `SELECT id, subject, type, title, description AS meta, file_url AS filename,
      size_mb AS sizeMb, duration
     FROM study_materials WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

// Search and filter the public materials catalog using bound values.
export async function listMaterials({ subject, type, query, limit }) {
  const searchTerm = `%${query}%`;
  const [rows] = await pool.execute(
    `SELECT id, subject, type, title, description AS meta, file_url AS filename,
      size_mb AS sizeMb, duration
     FROM study_materials
     WHERE (? = '' OR subject = ?)
       AND (? = '' OR type = ?)
       AND (? = '' OR title LIKE ? OR description LIKE ?)
     ORDER BY title
     LIMIT ?`,
    [subject, subject, type, type, query, searchTerm, searchTerm, limit],
  );
  return rows;
}

// Add one uploaded resource to the searchable materials table.
export async function createMaterial({ subject, type, title, description, fileUrl, sizeMb, duration }) {
  const [result] = await pool.execute(
    `INSERT INTO study_materials
      (subject, type, title, description, file_url, size_mb, duration)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [subject, type, title, description, fileUrl, sizeMb, duration || null],
  );
  return findMaterialById(result.insertId);
}

// Record each authenticated file download for student activity tracking.
export async function recordDownload(userId, materialId) {
  await pool.execute(
    'INSERT INTO material_downloads (user_id, material_id) VALUES (?, ?)',
    [userId, materialId],
  );
}

// Record an authenticated video view for profile activity and course counts.
export async function recordView(userId, materialId) {
  await pool.execute(
    'INSERT INTO material_views (user_id, material_id) VALUES (?, ?)',
    [userId, materialId],
  );
}

// Create a resource request and return its generated database identifier.
export async function createResourceRequest(userId, { subject, format }) {
  const [result] = await pool.execute(
    'INSERT INTO resource_requests (user_id, subject, format) VALUES (?, ?, ?)',
    [userId, subject, format],
  );
  return result.insertId;
}

// Return the signed-in student's own requests, newest first.
export async function listResourceRequests(userId) {
  const [rows] = await pool.execute(
    `SELECT id, subject, format, status, created_at AS createdAt
     FROM resource_requests WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
  );
  return rows;
}
