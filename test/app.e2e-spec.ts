import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('App e2e', () => {
  let app: INestApplication;
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
  });

  afterAll(() => {
    app.close();
  });
});
