import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // make the context change to HTTP and then get the request
    // is is the same of using Express.Request
    // Thus we access the request and get the user info
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
