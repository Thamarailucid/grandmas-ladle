import { database } from './src/database/connection.js';
import argon2 from 'argon2';

async function run() {
  const client = await database.connect();
  try {
    const email = 'admin@novacodex.in';
    const plainPassword = 'Novacodex@123';
    const hashedPassword = await argon2.hash(plainPassword);

    const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (rows.length > 0) {
      await client.query('UPDATE users SET password_hash = $1, role = $2 WHERE email = $3', [hashedPassword, 'ADMIN', email]);
      console.log('Updated existing user password and role to ADMIN.');
    } else {
      await client.query('INSERT INTO users (email, password_hash, name, role, is_active) VALUES ($1, $2, $3, $4, true)', [email, hashedPassword, 'Nova Codex Admin', 'ADMIN']);
      console.log('Created new Nova Codex Admin user.');
    }
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    process.exit(0);
  }
}
run();
