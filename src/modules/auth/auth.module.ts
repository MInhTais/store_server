import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { EnvConfigService } from '../../config/env.config';
import * as process from 'node:process';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EnvConfigService],
})
export class AuthModule {}
