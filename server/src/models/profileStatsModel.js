import pool from '../config/db.js';

// Count profile metrics in SQL so the frontend does not need mock counters.
export async function getProfileCounts(userId) {
  const [savedRows] = await pool.execute(
    'SELECT COUNT(*) AS total FROM saved_careers WHERE user_id = ?',
    [userId],
  );
  const [courseRows] = await pool.execute(
    `SELECT COUNT(DISTINCT activity.material_id) AS total
     FROM (
       SELECT material_id FROM material_downloads WHERE user_id = ?
       UNION
       SELECT material_id FROM material_views WHERE user_id = ?
     ) AS activity`,
    [userId, userId],
  );
  const [connectionRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM connections
     WHERE (requester_id = ? OR receiver_id = ?) AND status = 'connected'`,
    [userId, userId],
  );
  const [downloadRows] = await pool.execute(
    'SELECT COUNT(*) AS total FROM material_downloads WHERE user_id = ?',
    [userId],
  );

  return {
    saved: Number(savedRows[0].total),
    courses: Number(courseRows[0].total),
    connections: Number(connectionRows[0].total),
    downloads: Number(downloadRows[0].total),
  };
}
