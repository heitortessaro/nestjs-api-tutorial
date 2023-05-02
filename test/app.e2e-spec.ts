import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  // Build a module for the test
  // uses the AppModule for it
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    //  we need to create a replica of the server with the same
    // pipes and validation since it is an e2e test
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // defines primsa as the prisma service based on the module
    prisma = app.get(PrismaService);
    // clean the db before tests
    await prisma.cleandb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it.todo('should signup');
    });
    describe('Signin', () => { });
  });

  describe('User', () => {
    describe('Get me', () => { });
    describe('Edit user', () => { });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => { });
    describe('Get bookmark', () => { });
    describe('Get bookmark by id', () => { });
    describe('Edit bookmark', () => { });
    describe('Delete bookmark', () => { });
  });
});
