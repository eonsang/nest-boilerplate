import { Test, TestingModule } from '@nestjs/testing';
import { SignupService } from './signup.service';
import { USER_REPOSITORY } from 'src/auth/domain/repository';
import { UserPrismaRepository } from 'src/auth/infra/repository/user.repository';

describe('SignupService', () => {
  let service: SignupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignupService, { provide: USER_REPOSITORY, useValue: {} }],
    }).compile();

    service = module.get<SignupService>(SignupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
