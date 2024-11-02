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

export const loginHistory = pgTable(
  'login_history',
  {
    loginId: serial('login_id').primaryKey().notNull(),
    userEmail: varchar('user_email', { length: 100 }).notNull(),
    loginTime: timestamp('login_time', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    ipAddress: varchar('ip_address', { length: 50 }),
  },
  (table) => {
    return {
      loginHistoryUserEmailFkey: foreignKey({
        columns: [table.userEmail],
        foreignColumns: [users.email],
        name: 'login_history_user_email_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const loginHistoryRelations = relations(loginHistory, ({ one }) => ({
  user: one(users, {
    fields: [loginHistory.userEmail],
    references: [users.email],
  }),
}));
