import db from '../db/db_connect';
import * as schema from '../entities/schema';
import { Roles } from '../../common/constants/roles.enum';

const main = async () => {
  try {
    console.log('Delete table in database');

    await db.delete(schema.roles);
    await db.delete(schema.users);
    await db.delete(schema.userRoles);
    await db.delete(schema.refreshTokens);
    await db.delete(schema.stores);
    await db.delete(schema.chats);
    await db.delete(schema.chatMessages);

    console.log('Sending database');

    await db.insert(schema.roles).values([
      {
        roleName: Roles.SYSTEM_ADMIN,
        description: 'Quản trị viên toàn hệ thống',
      },
      {
        roleName: Roles.USER,
        description: 'Người dùng có thể mở các quán ăn',
      },
      {
        roleName: Roles.CUSTOMER,
        description: 'Người dùng đăng nhập để đặt món',
      },
      {
        roleName: Roles.RESTAURANT_MANAGER,
        description: 'Quản lý nhà hàng',
      },
      {
        roleName: Roles.RESTAURANT_STAFF,
        description: 'Nhân viên phục vụ',
      },
      {
        roleName: Roles.RESTAURANT_CHEF,
        description: 'Nhân viên nhà bếp',
      },
    ]);

    await db.insert(schema.users).values([
      {
        email: 'minhtai2019cb2@gmail.com',
        password:
          '$2a$08$dIbgffpJH5k/xYi6cM4GO.bwFzBqCPyRsyVIYu7Qoy4pPod5vrQ5i',
        dateOfBirth: '2001-10-19',
        name: 'Nguyễn Minh Tại',
        points: 0,
        avatar: '',
        verify: 'Verified',
        forgotPasswordToken: '',
        emailVerifiedToken: '',
      },
      {
        email: 'minhanh@gmail.com',
        password:
          '$2a$08$dIbgffpJH5k/xYi6cM4GO.bwFzBqCPyRsyVIYu7Qoy4pPod5vrQ5i',
        dateOfBirth: '2001-10-19',
        name: 'Nguyễn Minh Anh',
        points: 200,
        avatar: '',
        verify: 'Verified',
        forgotPasswordToken: '',
        emailVerifiedToken: '',
      },
    ]);

    await db.insert(schema.userRoles).values([
      {
        userEmail: 'minhtai2019cb2@gmail.com',
        roleName: Roles.USER,
      },
      {
        userEmail: 'minhtai2019cb2@gmail.com',
        roleName: Roles.RESTAURANT_MANAGER,
      },
      {
        userEmail: 'minhanh@gmail.com',
        roleName: Roles.RESTAURANT_MANAGER,
      },
    ]);

    await db.insert(schema.stores).values([
      {
        storeId: 1,
        userEmail: 'minhtai2019cb2@gmail.com',
        storeName: 'Store One',
        qrCode: 'QR_CODE_1',
        createdAt: new Date().toISOString(),
      },
      {
        storeId: 2,
        userEmail: 'minhanh@gmail.com',
        storeName: 'Store Two',
        qrCode: 'QR_CODE_2',
        createdAt: new Date().toISOString(),
      },
    ]);

    await db.insert(schema.chats).values([
      {
        chatId: 1,
        userOneEmail: 'minhtai2019cb2@gmail.com',
        userTwoEmail: 'minhanh@gmail.com', // Chat giữa hai người dùng
        storeId: null, // Không có cửa hàng
        isStoreChat: false,
        createdAt: '2024-11-01T10:00:00Z',
      },
    ]);

    await console.log('Sedding finished');
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send database');
  }
};

main();
