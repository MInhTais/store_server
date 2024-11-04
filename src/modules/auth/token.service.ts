import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvConfigService } from '../../config/env.config';
import { users } from '../../database/entities/schema';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private envConfigService: EnvConfigService,
  ) {}

  generateAccessToken(user: typeof users.$inferSelect) {
    const payload = {
      email: user.email,
      sub: user.name,
    };
    return this.jwtService.sign(payload, {
      expiresIn:
        this.envConfigService.getAccessTokenEx('ACCESS_TOKEN_EXPIRES') || '1h',
    });
  }

  generateRefreshToken(user: typeof users.$inferSelect) {
    const payload = {
      email: user.email,
      sub: user.name,
    };
    return this.jwtService.sign(payload, {
      expiresIn:
        this.envConfigService.getRefreshTokenEx('REFRESH_TOKEN_EXPIRES') ||
        '7d',
    });
  }

  verifyToken(token: string) {
    try {
      const secretKey = process.env.JWT_SECRET || 'defaultSecret';
      return this.jwtService.verify(token, { secret: secretKey });
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid token');
    }
  }
}
