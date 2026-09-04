import { database } from '../../database/connection.js';

export const findUserByEmail = async (email: string) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await database.query(query, [email]);
  return result.rows[0];
};

export const findUserById = async (id: string) => {
  const query = `
    SELECT id, email, name, role, created_at, updated_at 
    FROM users 
    WHERE id = $1
  `;
  const result = await database.query(query, [id]);
  return result.rows[0];
};

export const saveRefreshToken = async (userId: string, token: string, expiresAt: Date) => {
  const query = `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
  `;
  await database.query(query, [userId, token, expiresAt]);
};

export const deleteRefreshToken = async (token: string) => {
  const query = `DELETE FROM refresh_tokens WHERE token = $1`;
  await database.query(query, [token]);
};

export const findRefreshToken = async (token: string) => {
  const query = `SELECT * FROM refresh_tokens WHERE token = $1`;
  const result = await database.query(query, [token]);
  return result.rows[0];
};

export const deleteAllUserRefreshTokens = async (userId: string) => {
  const query = `DELETE FROM refresh_tokens WHERE user_id = $1`;
  await database.query(query, [userId]);
};

export const updatePassword = async (userId: string, passwordHash: string) => {
  const query = `
    UPDATE users 
    SET password_hash = $1, updated_at = NOW()
    WHERE id = $2
  `;
  await database.query(query, [passwordHash, userId]);
};

export const updateEmail = async (userId: string, email: string) => {
  const query = `
    UPDATE users 
    SET email = $1, updated_at = NOW()
    WHERE id = $2
  `;
  await database.query(query, [email, userId]);
};
