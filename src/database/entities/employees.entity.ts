import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stores } from './stores.entity';
import { relations } from 'drizzle-orm/relations';

export const employees = pgTable(
  'employees',
  {
    employeeId: serial('employee_id').primaryKey().notNull(),
    storeId: integer('store_id').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 15 }),
    position: varchar('position', { length: 50 }),
    createdAt: timestamp('created_at', { mode: 'string' }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => {
    return {
      employeesStoreIdFkey: foreignKey({
        columns: [table.storeId],
        foreignColumns: [stores.storeId],
        name: 'employees_store_id_fkey',
      }).onDelete('cascade'),
    };
  },
);

export const employeesRelations = relations(employees, ({ one }) => ({
  store: one(stores, {
    fields: [employees.storeId],
    references: [stores.storeId],
  }),
}));
