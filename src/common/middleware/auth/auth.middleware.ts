import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../../../modules/users/user.service';
import { EnvConfigService } from '../../../config/env.config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private envConfigService: EnvConfigService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const decoded: any = jwt.verify(
        token,
        this.envConfigService.getJwtSecret('JWT_SECRET') as string,
      );

      const user = await this.userService.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      req['user'] = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
    }
  }
}
