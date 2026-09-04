import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const database = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = await database.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
    return false;
  }
}
