import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  // users/me
  // The useGuard use the authGuard, which is implementing the jwt strategy
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  // the Request comes from Express. It enables to access the request data
  getMe(@Req() req: Request) {
    return req.user;
  }
}
