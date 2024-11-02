import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { tables } from './tables.entity';
import { stores } from './stores.entity';
import { relations } from 'drizzle-orm/relations';

export const qrcode = pgTable(
  'qrcode',
  {
    qrId: serial('qr_id').primaryKey().notNull(),
    tableId: integer('table_id'),
    storeId: integer('store_id'),
    qrCode: varchar('qr_code', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => {
    return {
      qrcodeTableIdFkey: foreignKey({
        columns: [table.tableId],
        foreignColumns: [tables.tableId],
        name: 'qrcode_table_id_fkey',
      }).onDelete('cascade'),
      qrcodeStoreIdFkey: foreignKey({
        columns: [table.storeId],
        foreignColumns: [stores.storeId],
        name: 'qrcode_store_id_fkey',
      }).onDelete('cascade'),
      qrcodeQrCodeKey: unique('qrcode_qr_code_key').on(table.qrCode),
    };
  },
);

export const qrcodeRelations = relations(qrcode, ({ one }) => ({
  table: one(tables, {
    fields: [qrcode.tableId],
    references: [tables.tableId],
  }),
  store: one(stores, {
    fields: [qrcode.storeId],
    references: [stores.storeId],
  }),
}));
