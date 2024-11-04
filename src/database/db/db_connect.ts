import { drizzle as dbLocal } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import * as schema from '../entities/schema';
import { config } from 'dotenv';

config({ path: '.env' });

const isNeon = process.env.USE_NEON === 'true';

let db;
if (isNeon) {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  db = drizzle(sql, { schema });
} else {
  const pool = new Pool({
    connectionString: process.env.LOCAL_DATABASE_URL,
  });

  pool
    .connect()
    .then(() => {
      console.log('DB connected successfully');
    })
    .catch((err) => {
      console.log('DB connection error:', err);
    });

  db = dbLocal(pool, { schema });
}

export default db;
