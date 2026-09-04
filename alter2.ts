import { database } from './services/api/src/database/connection.js';

async function run() {
  const client = await database.connect();
  try {
    await client.query("ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS sale_product_ids UUID[] DEFAULT '{}';");
    await client.query("ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(12,2);");
    console.log("Success");
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    process.exit(0);
  }
}
run();
