import { sql } from 'drizzle-orm';
import db from '../db/db_connect';

async function reset() {
  console.log('⏳ Resetting database...', process.env.NODE_ENV);
  const start = Date.now();

  try {
    // Drop all tables
    await db.execute(sql`
          DO $$ DECLARE
              r RECORD;
          BEGIN
              FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
                  EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
              END LOOP;
          END $$;
      `);

    // Drop all enums
    await db.execute(sql`
          DO $$ DECLARE
              r RECORD;
          BEGIN
              FOR r IN (select t.typname as enum_name
              from pg_type t 
                  join pg_enum e on t.oid = e.enumtypid  
                  join pg_catalog.pg_namespace n ON n.oid = t.typnamespace
              where n.nspname = current_schema()) LOOP
                  EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.enum_name);
              END LOOP;
          END $$;
      `);

    const end = Date.now();
    console.log(
      `✅ Reset end & took ${end - start}ms from `,
      process.env.NODE_ENV,
    );
    console.log('');
    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed from', process.env.NODE_ENV);
    console.error(err);
    process.exit(1);
  }
}

reset();
