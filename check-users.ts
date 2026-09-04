import { database } from './services/api/src/database/connection.js';

async function run() {
  const client = await database.connect();
  try {
    const { rows } = await client.query('SELECT id, email, name, role FROM users');
    console.log(JSON.stringify(rows, null, 2));
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    process.exit(0);
  }
}
run();
