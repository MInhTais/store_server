import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './modules/users/user.controller';
import { UserService } from './modules/users/user.service';
import { EnvConfigService } from './config/env.config';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { RolesGuard } from './common/guards/roles/roles.guard';
import { AuthMiddleware } from './common/middleware/auth/auth.middleware';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';

@Module({
  imports: [AuthModule, UserModule, RestaurantsModule],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, EnvConfigService, RolesGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users*', method: RequestMethod.ALL });
  }
}
