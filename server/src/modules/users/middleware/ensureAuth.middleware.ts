import { HttpException, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import authConfig from '../../../config/auth';

interface TokenPayload {
  sub: string;
}

export class EnsureAuthMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const authHeaders = request.headers.authorization;

    if (!authHeaders) {
      throw new HttpException('Invalid token header', 400);
    }

    const [bearer, token] = authHeaders.split(' ');

    if (!bearer || !token || bearer !== 'Bearer') {
      throw new HttpException('Invalid token header', 400);
    }

    try {
      const { secret } = authConfig.jwt;

      const decoded = jwt.verify(token, secret) as TokenPayload;

      request.user = {
        id: decoded.sub,
      };

      return next();
    } catch {
      throw new HttpException('Invalid token', 401);
    }
  }
}
