const { Client } = require('pg');
const fs = require('fs');
async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:root@123@localhost:5432/grandmas_ladle' });
  await client.connect();
  const sql = fs.readFileSync('services/api/migrations/007_sales_campaigns.sql', 'utf8');
  await client.query(sql);
  console.log('Migration 007 applied!');
  await client.end();
}
run();
