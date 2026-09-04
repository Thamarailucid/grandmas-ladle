const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:root@123@localhost:5432/grandmas_ladle' });

const dummyReviews = [
  { name: 'Ananya S.', loc: 'Indiranagar', rating: 5, content: 'The mini murukkus remind me exactly of how my grandmother used to make them. Perfectly crispy and not too oily. Will definitely order again for Diwali!' },
  { name: 'Rahul M.', loc: 'Koramangala', rating: 5, content: 'I ordered the corporate snack box for my team and everyone absolutely loved the authentic flavours. The packaging was neat and delivery was right on time.' },
  { name: 'Kavitha R.', loc: 'Jayanagar', rating: 4, content: 'The ladoos melt in your mouth. They use good quality ghee and you can taste it. Would love to see more varieties soon.' }
];

async function seed() {
  for (let i=0; i<dummyReviews.length; i++) {
    const r = dummyReviews[i];
    await pool.query(
      `INSERT INTO reviews (customer_name, customer_location, rating, content, is_published, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [r.name, r.loc, r.rating, r.content, true, i]
    );
  }
  console.log('Dummy reviews inserted successfully');
  pool.end();
}
seed().catch(console.error);
