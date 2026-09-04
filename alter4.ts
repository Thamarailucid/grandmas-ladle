import { database } from './services/api/src/database/connection.js';

async function run() {
  const client = await database.connect();
  try {
    await client.query("ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS is_global_sale_active BOOLEAN DEFAULT false;");
    await client.query("ALTER TABLE business_settings ADD COLUMN IF NOT EXISTS is_sale_widget_active BOOLEAN DEFAULT false;");
    console.log("Success");
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    process.exit(0);
  }
}
run();
