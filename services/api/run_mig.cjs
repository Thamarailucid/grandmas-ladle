const { Client } = require('pg');
const fs = require('fs');
async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:root@123@localhost:5432/grandmas_ladle' });
  await client.connect();
  const sql = fs.readFileSync('migrations/005_hero_slides_secondary_btn.sql', 'utf8');
  await client.query(sql);
  console.log('Migration 005 applied!');
  await client.end();
}
run();
