import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { getApiResponse } from '../../common/utils/apiResponse';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as UserRole } from '../../common/constants/roles.enum';

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.USER)
  async findAll() {
    const data = await this.userService.findAllUsers();
    return getApiResponse('Lấy thông tin thành công', data);
  }

  @Get('public')
  getPublicResource() {
    return 'This is a public resource';
  }
}
