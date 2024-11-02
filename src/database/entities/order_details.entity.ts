import {
  pgTable,
  serial,
  integer,
  foreignKey,
  timestamp,
} from 'drizzle-orm/pg-core';
import { orders } from './orders.entity';
import { menuItems } from './menu_items.entity';
import { relations } from 'drizzle-orm/relations';

export const orderDetails = pgTable(
  'order_details',
  {
    orderDetailId: serial('order_detail_id').primaryKey().notNull(),
    orderId: integer('order_id'),
    itemId: integer('item_id'),
    quantity: integer().notNull(),
    completionTime: timestamp('completion_time', { mode: 'string' }),
  },
  (table) => {
    return {
      orderDetailsOrderIdFkey: foreignKey({
        columns: [table.orderId],
        foreignColumns: [orders.orderId],
        name: 'order_details_order_id_fkey',
      }).onDelete('cascade'),
      orderDetailsItemIdFkey: foreignKey({
        columns: [table.itemId],
        foreignColumns: [menuItems.itemId],
        name: 'order_details_item_id_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  order: one(orders, {
    fields: [orderDetails.orderId],
    references: [orders.orderId],
  }),
  menuItem: one(menuItems, {
    fields: [orderDetails.itemId],
    references: [menuItems.itemId],
  }),
}));
