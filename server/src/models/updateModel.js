import pool from '../config/db.js';

// Fetch one page and the filtered total using bound limit and offset values.
export async function listUpdates({ category, limit, offset }) {
  const [rows] = await pool.execute(
    `SELECT id, category, title, summary, details, published_at AS publishedAt,
      CASE
        WHEN TIMESTAMPDIFF(MINUTE, published_at, CURRENT_TIMESTAMP) < 60
          THEN CONCAT(TIMESTAMPDIFF(MINUTE, published_at, CURRENT_TIMESTAMP), ' minutes ago')
        WHEN TIMESTAMPDIFF(HOUR, published_at, CURRENT_TIMESTAMP) < 24
          THEN CONCAT(TIMESTAMPDIFF(HOUR, published_at, CURRENT_TIMESTAMP), ' hours ago')
        ELSE CONCAT(TIMESTAMPDIFF(DAY, published_at, CURRENT_TIMESTAMP), ' days ago')
      END AS timeAgo
     FROM \`updates\`
     WHERE (? = '' OR category = ?)
     ORDER BY published_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    [category, category, limit, offset],
  );
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM \`updates\`
     WHERE (? = '' OR category = ?)`,
    [category, category],
  );
  return { rows, total: Number(countRows[0].total) };
}

// Find one complete update by its numeric identifier.
export async function findUpdateById(id) {
  const [rows] = await pool.execute(
    `SELECT id, category, title, summary, details, published_at AS publishedAt,
      CASE
        WHEN TIMESTAMPDIFF(MINUTE, published_at, CURRENT_TIMESTAMP) < 60
          THEN CONCAT(TIMESTAMPDIFF(MINUTE, published_at, CURRENT_TIMESTAMP), ' minutes ago')
        WHEN TIMESTAMPDIFF(HOUR, published_at, CURRENT_TIMESTAMP) < 24
          THEN CONCAT(TIMESTAMPDIFF(HOUR, published_at, CURRENT_TIMESTAMP), ' hours ago')
        ELSE CONCAT(TIMESTAMPDIFF(DAY, published_at, CURRENT_TIMESTAMP), ' days ago')
      END AS timeAgo
     FROM \`updates\` WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}
