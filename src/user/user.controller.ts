import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  // users/me
  // The useGuard use the authGuard, which is implementing the jwt strategy
  @UseGuards(JwtGuard)
  @Get('me')
  // the Request comes from Express. It enables to access the request data
  getMe(@Req() req: Request) {
    return req.user;
  }
}
