import pool from '../config/db.js';

// Find public skill offers and optionally omit the signed-in student's own offers.
export async function listPeers({ query, excludeUserId }) {
  const search = `%${query}%`;
  const excludedId = excludeUserId ?? 0;
  const [rows] = await pool.execute(
    `SELECT u.id, o.id AS offerId, u.name, u.avatar_url AS avatar,
      o.teach_skill AS teaches, o.learn_skill AS wantsToLearn,
      o.created_at AS createdAt
     FROM skill_offers o
     INNER JOIN users u ON u.id = o.user_id
     WHERE (? = '' OR u.name LIKE ? OR o.teach_skill LIKE ? OR o.learn_skill LIKE ?)
       AND (? = 0 OR u.id <> ?)
     ORDER BY o.created_at DESC, o.id DESC`,
    [query, search, search, search, excludedId, excludedId],
  );
  return rows;
}

// Load the current student's offers separately because public peer listings omit them.
export async function listUserSkillOffers(userId) {
  const [rows] = await pool.execute(
    `SELECT o.id AS offerId, u.id AS userId, u.name, u.avatar_url AS avatar,
      o.teach_skill AS teaches, o.learn_skill AS wantsToLearn,
      o.created_at AS createdAt
     FROM skill_offers o
     INNER JOIN users u ON u.id = o.user_id
     WHERE u.id = ?
     ORDER BY o.created_at DESC, o.id DESC`,
    [userId],
  );
  return rows;
}

// Insert a new skill offer and return its generated id.
export async function createSkillOffer(userId, { teach, learn }) {
  const [result] = await pool.execute(
    'INSERT INTO skill_offers (user_id, teach_skill, learn_skill) VALUES (?, ?, ?)',
    [userId, teach, learn],
  );
  return result.insertId;
}

// Find an existing offer so duplicate submissions can be treated as idempotent.
export async function findSkillOffer(userId, { teach, learn }) {
  const [rows] = await pool.execute(
    `SELECT id, user_id AS userId, teach_skill AS teach, learn_skill AS learn,
      created_at AS createdAt
     FROM skill_offers WHERE user_id = ? AND teach_skill = ? AND learn_skill = ? LIMIT 1`,
    [userId, teach, learn],
  );
  return rows[0] || null;
}

// Toggle a connection while locking both user rows to serialize concurrent requests.
export async function toggleConnection(requesterId, receiverId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [users] = await connection.execute(
      'SELECT id FROM users WHERE id IN (?, ?) ORDER BY id FOR UPDATE',
      [requesterId, receiverId],
    );
    if (users.length !== 2) {
      await connection.rollback();
      return { changed: false, connected: false, reason: 'user-not-found' };
    }

    const [existing] = await connection.execute(
      `SELECT id, requester_id, receiver_id
       FROM connections
       WHERE (requester_id = ? AND receiver_id = ?)
          OR (requester_id = ? AND receiver_id = ?)
       LIMIT 1 FOR UPDATE`,
      [requesterId, receiverId, receiverId, requesterId],
    );

    if (existing.length) {
      await connection.execute('DELETE FROM connections WHERE id = ?', [existing[0].id]);
      await connection.commit();
      return { changed: true, connected: false };
    }

    await connection.execute(
      `INSERT INTO connections (requester_id, receiver_id, status)
       VALUES (?, ?, 'connected')`,
      [requesterId, receiverId],
    );
    await connection.commit();
    return { changed: true, connected: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// List connected users in either direction for the current student.
export async function listConnections(userId) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.avatar_url AS avatar, u.stream,
      c.status, c.created_at AS connectedAt
     FROM connections c
     INNER JOIN users u
       ON u.id = CASE WHEN c.requester_id = ? THEN c.receiver_id ELSE c.requester_id END
     WHERE (c.requester_id = ? OR c.receiver_id = ?) AND c.status = 'connected'
     ORDER BY c.updated_at DESC`,
    [userId, userId, userId],
  );
  return rows;
}

// List upcoming sessions and compute each student's reservation state in the query.
export async function listUpcomingSessions(userId) {
  const [rows] = await pool.execute(
    `SELECT s.id, s.title, s.speaker, s.starts_at AS startsAt, s.badge,
      EXISTS(
        SELECT 1 FROM session_reservations r
        WHERE r.session_id = s.id AND r.user_id = ?
      ) AS reserved
     FROM live_sessions s
     WHERE s.starts_at > CURRENT_TIMESTAMP
     ORDER BY s.starts_at`,
    [userId || 0],
  );
  return rows.map((row) => ({ ...row, reserved: Boolean(row.reserved) }));
}

// Lock a future session and add its reservation only once.
export async function reserveSession(userId, sessionId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [sessions] = await connection.execute(
      `SELECT id FROM live_sessions
       WHERE id = ? AND starts_at > CURRENT_TIMESTAMP
       FOR UPDATE`,
      [sessionId],
    );
    if (!sessions.length) {
      await connection.rollback();
      return false;
    }

    await connection.execute(
      'INSERT IGNORE INTO session_reservations (user_id, session_id) VALUES (?, ?)',
      [userId, sessionId],
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

// Remove a student's reservation while checking that the session still exists.
export async function cancelSessionReservation(userId, sessionId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [sessions] = await connection.execute(
      'SELECT id FROM live_sessions WHERE id = ? FOR UPDATE',
      [sessionId],
    );
    if (!sessions.length) {
      await connection.rollback();
      return false;
    }

    await connection.execute(
      'DELETE FROM session_reservations WHERE user_id = ? AND session_id = ?',
      [userId, sessionId],
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
