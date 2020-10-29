import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

import { Request } from 'express';

export const UserDecorator = createParamDecorator(
  (userProperty: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user;

    if (!user) {
      throw new HttpException(
        'You must use this decorator with ensure authenticated middleware',
        400,
      );
    }

    return userProperty ? user[userProperty] : user;
  },
);
