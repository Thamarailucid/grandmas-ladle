import { database } from './src/database/connection.js';

async function alterTable() {
  try {
    await database.query(`
      ALTER TABLE business_settings
      ADD COLUMN is_cart_enabled BOOLEAN DEFAULT true;
    `);
    console.log('Added is_cart_enabled');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    process.exit(0);
  }
}
alterTable();
