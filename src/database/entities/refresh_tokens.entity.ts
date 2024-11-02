import {
  pgTable,
  serial,
  varchar,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './user.entity';
import { relations } from 'drizzle-orm/relations';

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    refreshTokenId: serial('refresh_token_id').primaryKey().notNull(),
    userEmail: varchar('user_email', { length: 100 }).notNull(),
    refreshToken: varchar('refresh_token', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => {
    return {
      refreshTokensUserEmailFkey: foreignKey({
        columns: [table.userEmail],
        foreignColumns: [users.email],
        name: 'refresh_tokens_user_email_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userEmail],
    references: [users.email],
  }),
}));
