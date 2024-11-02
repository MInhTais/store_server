import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';

dotenv.config();

@Injectable()
export class EnvConfigService {
  getPort(key: string): string | undefined {
    return process.env[key];
  }
  getAccessTokenEx(key: string): string | undefined {
    return process.env[key];
  }
  getRefreshTokenEx(key: string): string | undefined {
    return process.env[key];
  }

  getJwtSecret(key: string): string | undefined {
    return process.env[key];
  }
}
