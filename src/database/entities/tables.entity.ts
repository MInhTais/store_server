import {
  pgTable,
  serial,
  integer,
  varchar,
  foreignKey,
  unique,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stores } from './stores.entity';
import { relations } from 'drizzle-orm/relations';
import { qrcode } from './qrcode.entity';

export const tables = pgTable(
  'tables',
  {
    tableId: serial('table_id').primaryKey().notNull(),
    storeId: integer('store_id'),
    tableNumber: integer('table_number').notNull(),
    qrCode: varchar('qr_code', { length: 255 }).notNull(),
    status: varchar({ length: 20 }).default('Available'),
  },
  (table) => {
    return {
      tablesStoreIdFkey: foreignKey({
        columns: [table.storeId],
        foreignColumns: [stores.storeId],
        name: 'tables_store_id_fkey',
      }).onDelete('cascade'),
      tablesQrCodeKey: unique('tables_qr_code_key').on(table.qrCode),
      tablesStatusCheck: check(
        'tables_status_check',
        sql`(status)::text = ANY ((ARRAY['Available'::character varying, 'Occupied'::character varying])::text[])`,
      ),
    };
  },
);

export const tablesRelations = relations(tables, ({ one, many }) => ({
  store: one(stores, {
    fields: [tables.storeId],
    references: [stores.storeId],
  }),
  qrcodes: many(qrcode),
}));
