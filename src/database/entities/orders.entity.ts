import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  text,
  foreignKey,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './user.entity';
import { stores } from './stores.entity';
import { relations } from 'drizzle-orm/relations';
import { orderDetails } from './order_details.entity';
import { orderHistory } from './order_history.entity';
import { reviews } from './reviews.entity';

export const orders = pgTable(
  'orders',
  {
    orderId: serial('order_id').primaryKey().notNull(),
    storeId: integer('store_id'),
    userEmail: varchar('user_email', { length: 100 }),
    orderTime: timestamp('order_time', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    status: varchar({ length: 20 }).default('Pending'),
    tableNumber: integer('table_number'),
    notes: text(),
  },
  (table) => {
    return {
      ordersStoreIdFkey: foreignKey({
        columns: [table.storeId],
        foreignColumns: [stores.storeId],
        name: 'orders_store_id_fkey',
      }).onDelete('cascade'),
      ordersUserEmailFkey: foreignKey({
        columns: [table.userEmail],
        foreignColumns: [users.email],
        name: 'orders_user_email_fkey',
      }).onDelete('set null'),
      ordersStatusCheck: check(
        'orders_status_check',
        sql`(status)::text = ANY ((ARRAY['Pending'::character varying, 'In Progress'::character varying, 'Completed'::character varying])::text[])`,
      ),
    };
  },
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.storeId],
  }),
  user: one(users, {
    fields: [orders.userEmail],
    references: [users.email],
  }),
  orderDetails: many(orderDetails),
  orderHistories: many(orderHistory),
  reviews: many(reviews),
}));
