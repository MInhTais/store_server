import { pgTable, serial, varchar, foreignKey } from 'drizzle-orm/pg-core';
import { roles } from './roles.entity';
import { users } from './user.entity';
import { relations } from 'drizzle-orm/relations';

export const userRoles = pgTable(
  'user_roles',
  {
    roleId: serial('role_id').primaryKey().notNull(),
    roleName: varchar('role_name', { length: 50 }).notNull(),
    userEmail: varchar('user_email', { length: 100 }).notNull(),
  },
  (table) => {
    return {
      userRolesUserEmailFkey: foreignKey({
        columns: [table.userEmail],
        foreignColumns: [users.email],
        name: 'user_roles_user_email_fkey',
      }).onDelete('cascade'),
      userRolesRoleNameFkey: foreignKey({
        columns: [table.roleName],
        foreignColumns: [roles.roleName],
        name: 'user_roles_role_name_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userEmail],
    references: [users.email],
  }),
  role: one(roles, {
    fields: [userRoles.roleName],
    references: [roles.roleName],
  }),
}));
