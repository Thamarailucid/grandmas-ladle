import { query } from './services/api/src/config/db.js';

async function update() {
  const res = await query('SELECT id, name FROM product_categories', []);
  console.log(res.rows);
  
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
      await query('UPDATE product_categories SET image_url =  WHERE id = ', [url, cat.id]);
      console.log('Updated ' + cat.name);
    }
  }
  process.exit(0);
}
update().catch(console.error);
