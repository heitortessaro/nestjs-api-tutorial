import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

// The useGuard use the authGuard, which is implementing the jwt strategy
// The guard protects all routes of the controler
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  // users/me
  @Get('me')
  // Use the GetUser decorator defined in auth
  // user has the User type defined by Prisma
  getMe(@GetUser() user: User) {
    return user;
  }
}
