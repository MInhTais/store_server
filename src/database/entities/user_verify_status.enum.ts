import { pgEnum } from 'drizzle-orm/pg-core';

export const userVerifyStatus = pgEnum('user_verify_status', [
  'Unverified',
  'Verified',
  'Banned',
]);
