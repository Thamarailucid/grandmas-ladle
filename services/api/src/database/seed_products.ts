import { database } from './connection.js';
import { v4 as uuidv4 } from 'uuid';
import { generateSlug } from '../utils/slug.js';
import { fileURLToPath } from 'node:url';

const productsToSeed = [
  // Festival & Seasonal
  { categorySlug: 'festival-seasonal', name: 'Modakam / Kozhukattai (Poornam)', desc: 'Handcrafted steamed rice flour dumplings filled with fresh coconut and organic jaggery.', price: 180 },
  { categorySlug: 'festival-seasonal', name: 'Uppu Kozhukattai (Savoury Modakam)', desc: 'Steamed savoury rice dumplings tempered with mustard, urad dal, and green chilies.', price: 160 },
  { categorySlug: 'festival-seasonal', name: 'Ellu Kozhukattai', desc: 'Traditional steamed dumplings filled with roasted sesame seeds and jaggery.', price: 170 },
  { categorySlug: 'festival-seasonal', name: 'Ganesh Chaturthi Festival Combo Box', desc: 'Assorted box with 6 sweet modakams, 6 savoury modakams, fresh sundal, and handmade kai murukku.', price: 450 },

  // Traditional Snacks
  { categorySlug: 'traditional-snacks', name: 'Kai Murukku', desc: 'Handcrafted traditional crispy murukku, made with love and authentic ingredients.', price: 150 },
  { categorySlug: 'traditional-snacks', name: 'Ribbon Pakoda', desc: 'Crisp, melt-in-mouth golden ribbon sev prepared with pure butter and mild spices.', price: 140 },
  { categorySlug: 'traditional-snacks', name: 'Seedai (Uppu Seedai)', desc: 'Crunchy traditional round savoury bites made with rice flour, roasted urad dal, and butter.', price: 130 },
  { categorySlug: 'traditional-snacks', name: 'Pepper Thattai', desc: 'Crispy spiced rice crackers infused with coarsely cracked black pepper and curry leaves.', price: 140 },
  { categorySlug: 'traditional-snacks', name: 'Kuzhi Paniyaram', desc: 'Soft and fluffy paniyarams, perfect for a wholesome evening snack.', price: 120 },

  // Ladoos & Sweet Bites
  { categorySlug: 'ladoos-sweet-bites', name: 'Nei Urundai (Ghee Ladoo)', desc: 'Traditional roasted moong dal and pure country ghee balls infused with cardamom.', price: 210 },
  { categorySlug: 'ladoos-sweet-bites', name: 'Besan Ladoo', desc: 'Fragrant roasted gram flour sweet balls infused with pure desi ghee.', price: 200 },
  { categorySlug: 'ladoos-sweet-bites', name: 'Peanut & Dates Ladoo', desc: 'A healthy and sweet blend of roasted peanuts and premium dates.', price: 190 },
  { categorySlug: 'ladoos-sweet-bites', name: 'Sesame Ladoo (Ellu Urundai)', desc: 'Nutritious sesame seeds rolled into bite-sized traditional sweets.', price: 180 },
  { categorySlug: 'ladoos-sweet-bites', name: 'Multiseed Ladoo', desc: 'Power-packed ladoos made with a healthy mix of roasted seeds and nuts.', price: 220 },

  // Traditional & Wholesome
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
