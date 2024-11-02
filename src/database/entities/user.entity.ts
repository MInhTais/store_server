import {
  pgTable,
  varchar,
  text,
  integer,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { userVerifyStatus } from './user_verify_status.enum';
import { relations } from 'drizzle-orm/relations';
import { orders } from './orders.entity';
import { refreshTokens } from './refresh_tokens.entity';
import { orderHistory } from './order_history.entity';
import { loginHistory } from './login_history.entity';
import { reviews } from './reviews.entity';
import { userRoles } from './user_roles.entity';
import { stores } from './stores.entity';

export const users = pgTable('users', {
  email: varchar({ length: 100 }).primaryKey().notNull(),
  name: varchar({ length: 50 }),
  password: text(),
  points: integer().default(0),
  dateOfBirth: date('date_of_birth'),
  createdAt: timestamp('created_at', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: timestamp('updated_at', { mode: 'string' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  emailVerifiedToken: text('email_verified_token'),
  forgotPasswordToken: text('forgot_password_token'),
  avatar: text(),
  verify: userVerifyStatus().default('Unverified'),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  refreshTokens: many(refreshTokens),
  orderHistories: many(orderHistory),
  loginHistories: many(loginHistory),
  reviews: many(reviews),
  userRoles: many(userRoles),
  stores: many(stores),
}));
