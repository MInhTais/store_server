import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as UserRole } from '../../common/constants/roles.enum';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
@UseGuards(RolesGuard) // Áp dụng guard cho tất cả các route trong controller này
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.USER) // Chỉ cho phép ADMIN và QUẢN LÝ NHÀ HÀNG tạo nhà hàng
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.USER) // Cho phép ADMIN, QUẢN LÝ, và NHÂN VIÊN xem danh sách nhà hàng
  getAllRestaurants() {
    return this.restaurantsService.findAll();
  }
}
