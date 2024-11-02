import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { removePassword } from '../../common/utils/utils';
import { EnvConfigService } from '../../config/env.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async login(email: string, password: string) {
    const userWithPassword = await this.userService.findByEmail(email);
    if (!userWithPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(
      password,
      userWithPassword.password as string,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: userWithPassword.email,
      sub: userWithPassword.name,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn:
        this.envConfigService.getAccessTokenEx('ACCESS_TOKEN_EXPIRES') || '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn:
        this.envConfigService.getRefreshTokenEx('REFRESH_TOKEN_EXPIRES') ||
        '7d',
    });
    const user = removePassword(userWithPassword);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
