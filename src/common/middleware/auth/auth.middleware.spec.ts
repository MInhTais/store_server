import { AuthMiddleware } from './auth.middleware';
import { UserService } from '../../../modules/users/user.service';
import { EnvConfigService } from '../../../config/env.config';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let userService: UserService;
  let envConfigService: EnvConfigService;

  beforeEach(() => {
    userService = {
      findByEmail: jest.fn().mockResolvedValue(null),
    } as unknown as UserService;

    envConfigService = {
      getJwtSecret: jest.fn().mockReturnValue('secret'),
    } as unknown as EnvConfigService;

    authMiddleware = new AuthMiddleware(userService, envConfigService);
  });

  it('should be defined', () => {
    expect(authMiddleware).toBeDefined();
  });
});
