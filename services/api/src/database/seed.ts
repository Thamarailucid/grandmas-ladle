import { database } from './connection.js';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'node:url';

export async function seed() {
  const client = await database.connect();
  try {
    await client.query('BEGIN');
    console.log('Seeding database...');

    // Admin user
    const adminId = uuidv4();
    const adminEmail = 'admin@grandmasladle.com';
    const adminPassword = await argon2.hash('admin123'); // Example password

    const { rowCount: adminCount } = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminCount === 0) {
      await client.query(
        'INSERT INTO users (id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5)',
        [adminId, adminEmail, adminPassword, 'Admin', 'ADMIN']
      );
      console.log('✅ Admin user created');
    }

    // NovaCodex Admin user
    const novaAdminEmail = 'admin@novacodex.in';
    const novaAdminPassword = await argon2.hash('Novacodex@123');
    
    const { rowCount: novaAdminCount } = await client.query('SELECT id FROM users WHERE email = $1', [novaAdminEmail]);
    if (novaAdminCount === 0) {
      await client.query(
        'INSERT INTO users (id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5)',
        [uuidv4(), novaAdminEmail, novaAdminPassword, 'NovaCodex Admin', 'ADMIN']
      );
      console.log('✅ NovaCodex Admin user created');
    }

    // Categories
    const categories = [
      { name: 'Traditional Snacks', slug: 'traditional-snacks', description: 'Authentic savory snacks' },
      { name: 'Ladoos & Sweet Bites', slug: 'ladoos-sweet-bites', description: 'Traditional sweets and ladoos' },
      { name: 'Traditional & Wholesome', slug: 'traditional-wholesome', description: 'Wholesome everyday items' },
      { name: 'Festival & Seasonal', slug: 'festival-seasonal', description: 'Special seasonal preparations' },
    ];

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      await client.query(
        `INSERT INTO product_categories (id, name, slug, description, sort_order) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (slug) DO NOTHING`,
        [uuidv4(), cat.name, cat.slug, cat.description, i]
      );
    }
    console.log('✅ Product categories created');

    // Business settings
    const { rowCount: settingsCount } = await client.query('SELECT id FROM business_settings');
    if (settingsCount === 0) {
      await client.query(
        `INSERT INTO business_settings (
          id, business_name, phone, whatsapp, email, address, opening_hours, fssai_number, udyam_registered
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          uuidv4(),
          "Grandma's Ladle",
          '9841207516',
          '9841207516',
          'grandmasladle1269@gmail.com',
          'No.26/2, 4th Cross, Sawmill Road, New Thippasandra, Bangalore-560075',
          '10:00 AM TO 8:00 PM',
          '21226010006642',
          true
        ]
      );
      console.log('✅ Business settings created');
    }

    // FAQs
    const faqs = [
      { q: 'How long do the products stay fresh?', a: 'Our products are made without preservatives and typically stay fresh for 2-4 weeks when stored in an airtight container.' },
      { q: 'Do you use any preservatives?', a: 'No, we never use any artificial preservatives, colors, or flavors in our products. Everything is made traditionally.' },
      { q: 'Can I place a bulk order for a wedding or event?', a: 'Yes! Please use our Corporate Enquiry form or contact us directly for bulk orders and event catering.' },
    ];

    for (let i = 0; i < faqs.length; i++) {
      const faq = faqs[i];
      await client.query(
        'INSERT INTO faqs (id, question, answer, sort_order) SELECT $1, $2, $3, $4 WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question = $2)',
        [uuidv4(), faq.q, faq.a, i]
      );
    }
    console.log('✅ FAQs created');

    await client.query('COMMIT');
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
  } finally {
    client.release();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seed().then(() => process.exit(0));
}
