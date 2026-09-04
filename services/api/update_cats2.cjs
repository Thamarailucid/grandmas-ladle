const { Client } = require('pg');
const fs = require('fs');
async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:root@123@localhost:5432/grandmas_ladle' });
  await client.connect();
  const sql = fs.readFileSync('update_cats.sql', 'utf8');
  await client.query(sql);
  console.log('Categories updated!');
  await client.end();
}
run();
