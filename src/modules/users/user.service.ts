import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import db from 'src/database/db/db_connect';
import { removePassword } from '../../common/utils/utils';
import { users } from '../../database/entities/schema';

@Injectable()
export class UserService {
  async findAllUsers() {
    const users = await db.query.users.findMany({
      with: {
        userRoles: true,
      },
    });

    return removePassword(users);
  }

  async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        userRoles: true,
      },
    });
  }
}
