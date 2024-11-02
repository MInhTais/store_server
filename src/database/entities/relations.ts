import { relations } from 'drizzle-orm/relations';
import {
  stores,
  menuItems,
  orders,
  users,
  orderDetails,
  tables,
  qrcode,
  refreshTokens,
  employees,
  orderHistory,
  promotions,
  loginHistory,
  reviews,
  userRoles,
  roles,
} from './schema';

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  store: one(stores, {
    fields: [menuItems.storeId],
    references: [stores.storeId],
  }),
  orderDetails: many(orderDetails),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  menuItems: many(menuItems),
  orders: many(orders),
  tables: many(tables),
  qrcodes: many(qrcode),
  employees: many(employees),
  promotions: many(promotions),
  user: one(users, {
    fields: [stores.userEmail],
    references: [users.email],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.storeId],
  }),
  user: one(users, {
    fields: [orders.userEmail],
    references: [users.email],
  }),
  orderDetails: many(orderDetails),
  orderHistories: many(orderHistory),
  reviews: many(reviews),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  refreshTokens: many(refreshTokens),
  orderHistories: many(orderHistory),
  loginHistories: many(loginHistory),
  reviews: many(reviews),
  userRoles: many(userRoles),
  stores: many(stores),
}));

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

export const tablesRelations = relations(tables, ({ one, many }) => ({
  store: one(stores, {
    fields: [tables.storeId],
    references: [stores.storeId],
  }),
  qrcodes: many(qrcode),
}));

export const qrcodeRelations = relations(qrcode, ({ one }) => ({
  table: one(tables, {
    fields: [qrcode.tableId],
    references: [tables.tableId],
  }),
  store: one(stores, {
    fields: [qrcode.storeId],
    references: [stores.storeId],
  }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userEmail],
    references: [users.email],
  }),
}));

export const employeesRelations = relations(employees, ({ one }) => ({
  store: one(stores, {
    fields: [employees.storeId],
    references: [stores.storeId],
  }),
}));

export const orderHistoryRelations = relations(orderHistory, ({ one }) => ({
  user: one(users, {
    fields: [orderHistory.userEmail],
    references: [users.email],
  }),
  order: one(orders, {
    fields: [orderHistory.orderId],
    references: [orders.orderId],
  }),
}));

export const promotionsRelations = relations(promotions, ({ one }) => ({
  store: one(stores, {
    fields: [promotions.storeId],
    references: [stores.storeId],
  }),
}));

export const loginHistoryRelations = relations(loginHistory, ({ one }) => ({
  user: one(users, {
    fields: [loginHistory.userEmail],
    references: [users.email],
  }),
}));

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

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));
