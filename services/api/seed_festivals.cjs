const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:root@123@localhost:5432/grandmas_ladle' });

const dummyFestivals = [
  { name: 'Ganesh Chaturthi', slug: 'ganesh-chaturthi', desc: 'Modakam, Kozhukattai and festive savouries' },
  { name: 'Krishna Jayanthi', slug: 'krishna-jayanthi', desc: 'Murukku, seedai and traditional snacks' },
  { name: 'Navaratri', slug: 'navaratri', desc: 'Sundal varieties' },
  { name: 'Diwali', slug: 'diwali', desc: 'Traditional sweets, murukku and savouries' },
  { name: 'Pongal', slug: 'pongal', desc: 'Seasonal traditional preparations' },
  { name: 'Other occasions', slug: 'other-occasions', desc: 'Custom festive boxes and bulk orders where available' },
];

async function seed() {
  for (let i=0; i<dummyFestivals.length; i++) {
    const f = dummyFestivals[i];
    await pool.query(
      `INSERT INTO festivals (name, slug, description, is_active, sort_order) 
       VALUES ($1, $2, $3, true, $4)`,
      [f.name, f.slug, f.desc, i]
    );
  }
  console.log('Dummy festivals inserted successfully');
  pool.end();
}
seed().catch(console.error);
