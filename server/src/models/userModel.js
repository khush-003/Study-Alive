import pool from '../config/db.js';

// Convert database rows to the public student shape, never exposing password hashes.
function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    stream: row.stream,
    role: row.role,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

// Look up accounts by email for registration and login.
export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash AS passwordHash, stream, role,
      avatar_url, created_at
     FROM users WHERE email = ? LIMIT 1`,
    [email],
  );
  return rows[0] || null;
}

// Look up an account by identifier and return only fields safe for clients.
export async function findUserById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, email, stream, role, avatar_url, created_at
     FROM users WHERE id = ? LIMIT 1`,
    [id],
  );
  return toPublicUser(rows[0]);
}

// Insert a new account with a hash prepared by the authentication service.
export async function createUser({ name, email, passwordHash, stream }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash, stream) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, stream],
  );
  return findUserById(result.insertId);
}

// Update editable profile values using bound parameters.
export async function updateUser(id, { name, stream }) {
  await pool.execute(
    'UPDATE users SET name = ?, stream = ? WHERE id = ?',
    [name, stream, id],
  );
  return findUserById(id);
}

export { toPublicUser };
