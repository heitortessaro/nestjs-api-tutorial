import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        //  find all erros codes provided by prisma: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken. There is a unique constraint violation',
          );
        }
      }
      throw error;
    }
  }

  signin() {
    return { msg: 'I am signed in' };
  }
}
