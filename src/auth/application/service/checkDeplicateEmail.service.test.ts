import { Test, TestingModule } from '@nestjs/testing';
import { CheckDuplicateEmailService } from './checkDuplicateEmail.service';
import { USER_REPOSITORY } from 'src/auth/domain/repository';
import { AuthError } from '../error';

describe('CheckDuplicateEmailService', () => {
  let service: CheckDuplicateEmailService;
  let mockUserRepository: {
    existsByEmail: jest.Mock;
  };

  beforeEach(async () => {
    mockUserRepository = {
      existsByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckDuplicateEmailService,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<CheckDuplicateEmailService>(
      CheckDuplicateEmailService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return ok(true) when email exists', async () => {
    const email = 'test@example.com';
    mockUserRepository.existsByEmail.mockResolvedValue(true);

    const result = await service.execute(email);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(true);
    expect(mockUserRepository.existsByEmail).toHaveBeenCalled();
  });

  it('should return ok(false) when email does not exist', async () => {
    const email = 'test@example.com';
    mockUserRepository.existsByEmail.mockResolvedValue(false);

    const result = await service.execute(email);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(false);
    expect(mockUserRepository.existsByEmail).toHaveBeenCalled();
  });

  it('should return err(INVALID_EMAIL) when email is invalid', async () => {
    const invalidEmail = 'invalid-email';

    const result = await service.execute(invalidEmail);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(AuthError.INVALID_EMAIL);
    expect(mockUserRepository.existsByEmail).not.toHaveBeenCalled();
  });
});
