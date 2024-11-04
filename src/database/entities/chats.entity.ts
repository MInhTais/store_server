import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  foreignKey,
  integer,
} from 'drizzle-orm/pg-core';
import { users } from './user.entity';
import { stores } from './stores.entity';
import { relations } from 'drizzle-orm/relations';
import { sql } from 'drizzle-orm';
import { chatMessages } from './chat_messages.entity';

export const chats = pgTable(
  'chats',
  {
    chatId: serial('chat_id').primaryKey().notNull(),
    userOneEmail: varchar('user_one_email', { length: 100 }).notNull(),
    userTwoEmail: varchar('user_two_email', { length: 100 }), // Nullable nếu là chat với cửa hàng
    storeId: integer('store_id'), // Nullable nếu là chat giữa người dùng
    isStoreChat: boolean('is_store_chat').default(false), // Xác định có phải chat với cửa hàng không
    createdAt: timestamp('created_at', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => {
    return {
      userOneEmailFkey: foreignKey({
        columns: [table.userOneEmail],
        foreignColumns: [users.email],
        name: 'chats_user_one_email_fkey',
      }).onDelete('cascade'),
      userTwoEmailFkey: foreignKey({
        columns: [table.userTwoEmail],
        foreignColumns: [users.email],
        name: 'chats_user_two_email_fkey',
      }).onDelete('set null'),
      storeIdFkey: foreignKey({
        columns: [table.storeId],
        foreignColumns: [stores.storeId],
        name: 'chats_store_id_fkey',
      }).onDelete('set null'),
    };
  },
);

export const chatsRelations = relations(chats, ({ one, many }) => ({
  userOne: one(users, {
    fields: [chats.userOneEmail],
    references: [users.email],
  }),
  userTwo: one(users, {
    fields: [chats.userTwoEmail],
    references: [users.email],
  }),
  store: one(stores, {
    fields: [chats.storeId],
    references: [stores.storeId],
  }),
  messages: many(chatMessages), // Liên kết với bảng chatMessages
}));
