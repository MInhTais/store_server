import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './user.entity';
import { menuItems } from './menu_items.entity';
import { relations } from 'drizzle-orm/relations';
import { orders } from './orders.entity';

export const reviews = pgTable(
  'reviews',
  {
    reviewId: serial('review_id').primaryKey().notNull(),
    userEmail: varchar('user_email', { length: 100 }).notNull(),
    itemId: integer('item_id').notNull(),
    rating: integer('rating').notNull(),
    comment: text(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => {
    return {
      reviewsUserEmailFkey: foreignKey({
        columns: [table.userEmail],
        foreignColumns: [users.email],
        name: 'reviews_user_email_fkey',
      }).onDelete('cascade'),
      reviewsItemIdFkey: foreignKey({
        columns: [table.itemId],
        foreignColumns: [menuItems.itemId],
        name: 'reviews_item_id_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, {
    fields: [reviews.reviewId],
    references: [orders.orderId],
  }),
  user: one(users, {
    fields: [reviews.userEmail],
    references: [users.email],
  }),
}));
