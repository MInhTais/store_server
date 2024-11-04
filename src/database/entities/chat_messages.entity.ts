import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  foreignKey,
  integer,
} from 'drizzle-orm/pg-core';
import { chats } from './chats.entity';
import { users } from './user.entity';
import { stores } from './stores.entity';
import { relations } from 'drizzle-orm/relations';
import { sql } from 'drizzle-orm';

export const chatMessages = pgTable(
  'chat_messages',
  {
    messageId: serial('message_id').primaryKey().notNull(),
    chatId: serial('chat_id').notNull(),
    senderEmail: varchar('sender_email', { length: 100 }), // Nullable nếu người gửi là cửa hàng
    storeId: integer('store_id'), // Nullable nếu người gửi là người dùng
    content: text('content').notNull(),
    sentAt: timestamp('created_at', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => {
    return {
      chatIdFkey: foreignKey({
        columns: [table.chatId],
        foreignColumns: [chats.chatId],
        name: 'chat_messages_chat_id_fkey',
      }).onDelete('cascade'),
      senderEmailFkey: foreignKey({
        columns: [table.senderEmail],
        foreignColumns: [users.email],
        name: 'chat_messages_sender_email_fkey',
      }).onDelete('set null'),
      storeIdFkey: foreignKey({
        columns: [table.storeId],
        foreignColumns: [stores.storeId],
        name: 'chat_messages_store_id_fkey',
      }).onDelete('set null'),
    };
  },
);

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMessages.chatId],
    references: [chats.chatId],
  }),
  senderUser: one(users, {
    fields: [chatMessages.senderEmail],
    references: [users.email],
  }),
  senderStore: one(stores, {
    fields: [chatMessages.storeId],
    references: [stores.storeId],
  }),
}));
