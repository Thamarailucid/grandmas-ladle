import { createClient } from '@supabase/supabase-js';
import { database } from '../database/connection.js';
import fs from 'fs/promises';
import path from 'path';

// This script migrates images stored on the local EC2 server's disk to Supabase Storage,
// and updates the corresponding rows in the PostgreSQL database.

async function migrateImages() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  console.log('🔄 Starting Image Migration to Supabase...');

  const tablesToCheck = [
    { name: 'products', column: 'image_url' },
    { name: 'product_categories', column: 'image_url' },
    { name: 'hero_slides', column: 'image_url' },
    { name: 'festivals', column: 'banner_image_url' },
    { name: 'blog_posts', column: 'cover_image_url' }
  ];

  let totalUpdated = 0;
  let totalMissing = 0;

  for (const table of tablesToCheck) {
    console.log(`\n🔍 Checking table: ${table.name}`);
    
    // Find records that don't point to Supabase yet
    const query = `
      SELECT id, ${table.column} as image_url 
      FROM ${table.name} 
      WHERE ${table.column} IS NOT NULL 
        AND ${table.column} NOT LIKE '%supabase.co%'
    `;
    
    const { rows } = await database.query(query);
    console.log(`Found ${rows.length} records needing migration in ${table.name}.`);

    for (const row of rows) {
      const url = row.image_url;
      // Extract the filename from the URL, e.g., "http://grandmaapi.novacodex.in/uploads/xyz.webp" -> "xyz.webp"
      const filenameMatch = url.match(/\/uploads\/([^\/]+)$/);
      if (!filenameMatch) {
        console.warn(`⚠️ Skipped record ${row.id}: URL format unrecognized (${url})`);
        continue;
      }
      
      const filename = filenameMatch[1];
      const localFilePath = path.join(uploadDir, filename);

      try {
        // Read file from local disk
        const fileBuffer = await fs.readFile(localFilePath);
        
        // Upload to Supabase
        const { error } = await supabase
          .storage
          .from('uploads')
          .upload(filename, fileBuffer, {
            contentType: 'image/webp',
            upsert: true
          });

        if (error) throw new Error(`Supabase upload failed: ${error.message}`);

        // Get public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('uploads')
          .getPublicUrl(filename);
          
        const newUrl = publicUrlData.publicUrl;

        // Update database record
        await database.query(
          `UPDATE ${table.name} SET ${table.column} = $1 WHERE id = $2`,
          [newUrl, row.id]
        );

        console.log(`✅ Migrated ${filename} for ${table.name} id ${row.id}`);
        totalUpdated++;

      } catch (err: any) {
        if (err.code === 'ENOENT') {
          console.warn(`❌ Missing local file for record ${row.id}: ${localFilePath}`);
          totalMissing++;
        } else {
          console.error(`❌ Failed to migrate ${filename} for record ${row.id}:`, err.message);
        }
      }
    }
  }

  console.log(`\n🎉 Migration complete!`);
  console.log(`✅ Successfully updated: ${totalUpdated}`);
  console.log(`❌ Missing local files: ${totalMissing}`);
  process.exit(0);
}

migrateImages();
