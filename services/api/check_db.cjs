const { Client } = require('pg');
async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:root@123@localhost:5432/grandmas_ladle' });
  await client.connect();
  const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = ''public'';');
  console.log(res.rows.map(r => r.table_name));
  await client.end();
}
run();
