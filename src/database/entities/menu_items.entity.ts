import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  text,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stores } from './stores.entity';
import { relations } from 'drizzle-orm/relations';
import { orderDetails } from './order_details.entity';

export const menuItems = pgTable(
  'menu_items',
  {
    itemId: serial('item_id').primaryKey().notNull(),
    storeId: integer('store_id'),
    itemName: varchar('item_name', { length: 100 }).notNull(),
    price: numeric({ precision: 10, scale: 2 }).notNull(),
    description: text(),
    imageUrl: varchar('image_url', { length: 255 }),
    nutritionalInfo: text('nutritional_info'),
    createdAt: timestamp('created_at', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => {
    return {
      menuItemsStoreIdFkey: foreignKey({
        columns: [table.storeId],
        foreignColumns: [stores.storeId],
        name: 'menu_items_store_id_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  store: one(stores, {
    fields: [menuItems.storeId],
    references: [stores.storeId],
  }),
  orderDetails: many(orderDetails),
}));
