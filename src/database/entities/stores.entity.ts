import {
  pgTable,
  serial,
  varchar,
  timestamp,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm/relations';
import { menuItems } from './menu_items.entity';
import { orders } from './orders.entity';
import { tables } from './tables.entity';
import { qrcode } from './qrcode.entity';
import { employees } from './employees.entity';
import { promotions } from './promotions.entity';
import { users } from './user.entity';

export const stores = pgTable(
  'stores',
  {
    storeId: serial('store_id').primaryKey().notNull(),
    userEmail: varchar('user_email', { length: 100 }),
    storeName: varchar('store_name', { length: 100 }).notNull(),
    qrCode: varchar('qr_code', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => {
    return {
      storesUserEmailFkey: foreignKey({
        columns: [table.userEmail],
        foreignColumns: [users.email],
        name: 'stores_user_email_fkey',
      }).onDelete('cascade'),
      storesQrCodeKey: unique('stores_qr_code_key').on(table.qrCode),
    };
  },
);

export const storesRelations = relations(stores, ({ one, many }) => ({
  menuItems: many(menuItems),
  orders: many(orders),
  tables: many(tables),
  qrcodes: many(qrcode),
  employees: many(employees),
  promotions: many(promotions),
  user: one(users, {
    fields: [stores.userEmail],
    references: [users.email],
  }),
}));
