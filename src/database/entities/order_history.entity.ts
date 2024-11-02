import {
  pgTable,
  serial,
  integer,
  timestamp,
  foreignKey,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.entity';
import { users } from './user.entity';
import { relations } from 'drizzle-orm/relations';

export const orderHistory = pgTable(
  'order_history',
  {
    historyId: serial('history_id').primaryKey().notNull(),
    orderId: integer('order_id'),
    userEmail: varchar({ length: 100 }).notNull(),
    order_time: timestamp('timestamp', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    action: varchar('action', { length: 50 }).notNull(),
    details: varchar('details', { length: 255 }),
  },
  (table) => {
    return {
      orderHistoryOrderIdFkey: foreignKey({
        columns: [table.orderId],
        foreignColumns: [orders.orderId],
        name: 'order_history_order_id_fkey',
      }).onDelete('cascade'),
      orderHistoryUserEmailFkey: foreignKey({
        columns: [table.userEmail],
        foreignColumns: [users.email],
        name: 'order_history_users_email_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const orderHistoryRelations = relations(orderHistory, ({ one }) => ({
  user: one(users, {
    fields: [orderHistory.userEmail],
    references: [users.email],
  }),
  order: one(orders, {
    fields: [orderHistory.orderId],
    references: [orders.orderId],
  }),
}));
