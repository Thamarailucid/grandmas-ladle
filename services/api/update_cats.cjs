const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:root@123@localhost:5432/grandmas_ladle'
  });
  await client.connect();
  const res = await client.query('SELECT id, name FROM product_categories');
  
  const map = {
    'Traditional Snacks': 'traditional_snacks.jpg',
    'Ladoos & Sweet Bites': 'ladoos.jpg',
    'Sundal': 'sundal.jpg',
    'Modakam & Seasonal Specials': 'modakam.jpg',
    'Ragi & Millet Foods': 'millet_foods.jpg',
    'Festival & Bulk Orders': 'festival_orders.jpg'
  };

  for (const cat of res.rows) {
    const filename = map[cat.name];
    if (filename) {
      const url = 'http://localhost:5000/uploads/' + filename;
      await client.query('UPDATE product_categories SET image_url =  WHERE id = ', [url, cat.id]);
      console.log('Updated ' + cat.name);
    }
  }
  await client.end();
}
run().catch(console.error);
