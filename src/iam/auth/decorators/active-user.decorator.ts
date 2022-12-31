import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { User } from 'src/users/entities/user.entity';

export const ActiveUser = createParamDecorator(
  (
    field: keyof Omit<User, 'password'> | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user: User = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
