import { database } from './services/api/src/database/connection.js';

async function run() {
  const client = await database.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image_url TEXT NOT NULL,
        title TEXT,
        subtitle TEXT,
        cta_text TEXT,
        cta_link TEXT,
        is_image_only BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Add trigger for updated_at
    await client.query(`
      DROP TRIGGER IF EXISTS set_timestamp_hero_slides ON hero_slides;
      CREATE TRIGGER set_timestamp_hero_slides
      BEFORE UPDATE ON hero_slides
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    // Insert initial seed data if empty
    const { rows } = await client.query('SELECT count(*) FROM hero_slides');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO hero_slides (image_url, title, subtitle, cta_text, cta_link, is_image_only, sort_order)
        VALUES (
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070',
          'GRANDMA''S LADLE',
          'Traditional goodness, from our kitchen to yours. Wholesome traditional foods, homemade snacks and timeless recipes inspired by the women who taught us the meaning of hard work and feeding with love.',
          'ORDER NOW',
          '/menu',
          false,
          0
        );
      `);
    }

    console.log("Success: Created hero_slides table and seeded data.");
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    process.exit(0);
  }
}
run();
