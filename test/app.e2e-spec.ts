import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
// pactum is a request making library, so it need a server/api to make these requests
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

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
    await app.listen(3333);

    // defines primsa as the prisma service based on the module
    prisma = app.get(PrismaService);
    // clean the db before tests
    await prisma.cleandb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.com',
      password: 'password',
    };

    describe('Signup', () => {
      it('should throw if  email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAthorizationToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should not get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer no token',
          })
          .expectStatus(401);
      });
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should get current user', () => {
        const dto: EditUserDto = {
          firstName: 'Test Modification',
          email: 'new-test@testmail.com',
        };

        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create bookmarks', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'www.google.com',
        description: 'research engine',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.description)
          .stores('bookmarkId', 'id')
          .stores('bookmarkTitle', 'title');
      });
    });
    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get  bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains('$S{bookmarkTitle}');
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'google',
      };
      it('should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAthorizationToken}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
