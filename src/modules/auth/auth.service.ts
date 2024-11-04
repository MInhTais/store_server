import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { removePassword } from '../../common/utils/utils';
import db from '../../database/db/db_connect';
import { refreshTokens } from '../../database/entities/refresh_tokens.entity';
import { TokenService } from './token.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private tokenService: TokenService,
  ) {}

  async saveRefreshToken(userEmail: string, refreshToken: string) {
    await db.insert(refreshTokens).values({ userEmail, refreshToken });
  }

  async refreshToken(rToken: string) {
    try {
      const payload = this.tokenService.verifyToken(rToken);
      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.refreshToken, rToken),
      });

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException(
          'Invalid refresh token: Token does not exist in the server',
        );
      }

      const newAccessToken = this.tokenService.generateAccessToken(user);
      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error, 'Invalid refresh token');
    }
  }

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

    const user = removePassword(userWithPassword);
    const accessToken = this.tokenService.generateAccessToken(userWithPassword);
    const refreshToken =
      this.tokenService.generateRefreshToken(userWithPassword);

    await this.saveRefreshToken(userWithPassword.email, refreshToken);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
