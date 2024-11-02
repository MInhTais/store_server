import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  text,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stores } from './stores.entity';
import { relations } from 'drizzle-orm/relations';

export const promotions = pgTable(
  'promotions',
  {
    promotionId: serial('promotion_id').primaryKey().notNull(),
    storeId: integer('store_id').notNull(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text(),
    startDate: timestamp('start_date', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    endDate: timestamp('end_date', { mode: 'string' }),
  },
  (table) => {
    return {
      promotionsStoreIdFkey: foreignKey({
        columns: [table.storeId],
        foreignColumns: [stores.storeId],
        name: 'promotions_store_id_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const promotionsRelations = relations(promotions, ({ one }) => ({
  store: one(stores, {
    fields: [promotions.storeId],
    references: [stores.storeId],
  }),
}));
