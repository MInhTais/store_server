import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm/relations';
import { userRoles } from './user_roles.entity';

export const roles = pgTable('roles', {
  roleName: varchar('role_name', { length: 50 }).primaryKey().notNull(),
  description: varchar({ length: 150 }),
  createdAt: timestamp('created_at', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));
