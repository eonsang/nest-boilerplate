import { Test, TestingModule } from '@nestjs/testing';
import { SignupService } from './signup.service';
import { AUTH_REPOSITORY, USER_REPOSITORY } from 'src/auth/domain/repository';
import { EMAIL_SENDER } from '../port/out';
import { GenerateJwtService } from './generateJwt.service';

describe('SignupService', () => {
  let service: SignupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupService,
        GenerateJwtService,
        { provide: USER_REPOSITORY, useValue: {} },
        { provide: EMAIL_SENDER, useValue: {} },
        { provide: AUTH_REPOSITORY, useValue: {} },
      ],
    }).compile();

    service = module.get<SignupService>(SignupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
