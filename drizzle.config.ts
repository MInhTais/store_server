import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

const schemaPath = './src/database/entities/schema.ts';
const outPath = './src/database/migrations/drizzle';

const isNeon = process.env.USE_NEON === 'true';
export default defineConfig({
  schema: schemaPath,
  out: outPath,
  dialect: 'postgresql',
  dbCredentials: {
    url: isNeon
      ? process.env.NEON_DATABASE_URL!
      : process.env.LOCAL_DATABASE_URL!,
    ssl: isNeon,
  },
});
