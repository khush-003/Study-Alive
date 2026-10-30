import pool from '../config/db.js';

// Reserve one of a student's hourly AI requests before sending work to Gemini.
export async function reserveAiUsage(userId, feature, maximumRequests = 20) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [users] = await connection.execute(
      'SELECT id FROM users WHERE id = ? FOR UPDATE',
      [userId],
    );
    if (!users.length) {
      await connection.rollback();
      return false;
    }

    const [counts] = await connection.execute(
      `SELECT COUNT(*) AS total FROM ai_usage_logs
       WHERE user_id = ? AND created_at >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)`,
      [userId],
    );
    if (Number(counts[0].total) >= maximumRequests) {
      await connection.rollback();
      return false;
    }

    await connection.execute(
      'INSERT INTO ai_usage_logs (user_id, feature) VALUES (?, ?)',
      [userId, feature],
    );
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
