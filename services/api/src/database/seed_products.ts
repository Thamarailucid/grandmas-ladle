import { database } from './connection.js';
import { v4 as uuidv4 } from 'uuid';
import { generateSlug } from '../utils/slug.js';
import { fileURLToPath } from 'node:url';

const productsToSeed = [
  { categorySlug: 'traditional-snacks', name: 'Kai Murukku', desc: 'Handcrafted traditional crispy murukku, made with love and authentic ingredients.', price: 150 },
  { categorySlug: 'traditional-snacks', name: 'Kuzhi Paniyaram', desc: 'Soft and fluffy paniyarams, perfect for a wholesome evening snack.', price: 120 },
  { categorySlug: 'traditional-snacks', name: 'Modakam/Kozhukattai', desc: 'Sweet jaggery and coconut filled dumplings, a traditional delicacy.', price: 180 },
  { categorySlug: 'ladoos-sweet-bites', name: 'Peanut & Dates Ladoo', desc: 'A healthy and sweet blend of roasted peanuts and premium dates.', price: 200 },
  { categorySlug: 'ladoos-sweet-bites', name: 'Sesame Ladoo', desc: 'Nutritious sesame seeds rolled into bite-sized traditional sweets.', price: 190 },
  { categorySlug: 'ladoos-sweet-bites', name: 'Multiseed Ladoo', desc: 'Power-packed ladoos made with a healthy mix of roasted seeds and nuts.', price: 220 },
  { categorySlug: 'traditional-wholesome', name: 'Sundal', desc: 'Wholesome tempered legumes, a staple healthy snack from Grandma\'s kitchen.', price: 80 },
  { categorySlug: 'traditional-wholesome', name: 'Ragi Malt', desc: 'Nutritious and comforting ragi based traditional malt drink.', price: 90 },
  { categorySlug: 'traditional-wholesome', name: 'Ulundhu Kanji', desc: 'Healthy black gram porridge, known for its strengthening properties.', price: 110 },
];

async function seedProducts() {
  const client = await database.connect();
  try {
    await client.query('BEGIN');
    console.log('Seeding products...');

    for (let i = 0; i < productsToSeed.length; i++) {
      const p = productsToSeed[i];
      
      // Get category ID
      const { rows } = await client.query('SELECT id FROM product_categories WHERE slug = $1', [p.categorySlug]);
      if (rows.length === 0) {
        console.log(`⚠️ Category not found for slug: ${p.categorySlug}`);
        continue;
      }
      const categoryId = rows[0].id;

      // Check if product exists
      const slug = generateSlug(p.name);
      const { rowCount } = await client.query('SELECT id FROM products WHERE slug = $1', [slug]);
      
      if (rowCount === 0) {
        await client.query(
          `INSERT INTO products (id, category_id, name, slug, short_description, description, price, is_available, sort_order) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [uuidv4(), categoryId, p.name, slug, p.desc, p.desc, p.price, true, i]
        );
        console.log(`✅ Inserted: ${p.name}`);
      } else {
        console.log(`⏩ Skipped (already exists): ${p.name}`);
      }
    }

    await client.query('COMMIT');
    console.log('✅ Product seeding completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
  } finally {
    client.release();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedProducts().then(() => process.exit(0));
}
