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

    // Business settings (only if empty)
    const { rowCount: settingsCount } = await client.query('SELECT id FROM business_settings');
    if (settingsCount === 0) {
      await client.query(
        `INSERT INTO business_settings (
          id, business_name, phone, whatsapp, email, address, opening_hours, fssai_number, udyam_registered, google_maps_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          uuidv4(),
          "Grandma's Ladle",
          '9841207516',
          '+919841207516',
          'grandmasladle1269@gmail.com',
          'No.26/2, 4th Cross, Sawmill Road, New Thippasandra, Bangalore-560075',
          'Monday to Saturday : 10:00 AM TO 8:00 PM',
          '21226010006642',
          true,
          'https://maps.google.com/maps?q=12.9750239,77.6540696&hl=en&z=17&output=embed'
        ]
      );
      console.log('✅ Business settings initialized');
    }

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
