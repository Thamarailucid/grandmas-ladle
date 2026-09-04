import { database } from './services/api/src/database/connection.js';

async function run() {
  const client = await database.connect();
  try {
    await client.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS offer_price NUMERIC(12,2);");
    console.log("Success");
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    process.exit(0);
  }
}
run();
