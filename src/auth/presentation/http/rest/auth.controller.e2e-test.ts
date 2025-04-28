import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
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

  describe('POST /auth/email-verify-code', () => {
    it('이메일 인증 코드 전송 성공', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/email-verify-code')
        .send({
          email: 'test@test.com',
        });

      expect(response.status).toBe(201);
    });
  });
});
