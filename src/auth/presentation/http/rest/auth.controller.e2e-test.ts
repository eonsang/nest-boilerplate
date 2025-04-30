import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { generateSecurePassword } from 'src/constants';
import request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /auth/check-duplicate-email', () => {
    it('should return false, when email is not exists', async () => {
      const email = faker.internet.email();
      const response = await request(app.getHttpServer()).get('/auth/check-duplicate-email').query({
        email,
      });

      expect(response.status).toBe(200);
      expect(response.text).toBe('false');
    });

    it('should return true, when email is exists', async () => {
      const email = faker.internet.email();
      await request(app.getHttpServer()).post('/auth/signup/email').send({
        email: email,
        password: generateSecurePassword(),
      });
      const response = await request(app.getHttpServer()).get('/auth/check-duplicate-email').query({
        email,
      });

      expect(response.status).toBe(200);
      expect(response.text).toBe('true');
    });
  });

  describe('POST /auth/send-email-verify-code', () => {
    it('should return true, when email is not exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/send-email-verify-code')
        .send({
          email: faker.internet.email(),
        });

      expect(response.status).toBe(201);
      expect(response.text).toBe('true');
    });

    it('should return false, when email is exists', async () => {
      const email = faker.internet.email();
      await request(app.getHttpServer()).post('/auth/signup/email').send({
        email,
        password: generateSecurePassword(),
      });
      const response = await request(app.getHttpServer())
        .post('/auth/send-email-verify-code')
        .send({
          email,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/signup/email', () => {
    it('이메일 회원가입 성공', async () => {
      const email = faker.internet.email();
      const response = await request(app.getHttpServer()).post('/auth/signup/email').send({
        email: email,
        password: generateSecurePassword(),
      });

      expect(response.status).toBe(201);
    });
  });
});
