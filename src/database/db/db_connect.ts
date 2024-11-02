import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../entities/schema';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
});

pool
  .connect()
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.log(err);
  });

const db = drizzle(pool, { schema });

export default db;
