import { Test, TestingModule } from '@nestjs/testing';
import { SignupService } from './signup.service';
import { AUTH_REPOSITORY, USER_REPOSITORY } from 'src/auth/domain/repository';
import { EMAIL_SENDER } from '../port/out';
import { GenerateJwtService } from './generateJwt.service';
import { User } from 'src/auth/domain/entity';
import { AuthError } from '../error';
import { UserRepository } from 'src/auth/domain/repository';
import { EmailSenderOutPort } from 'src/auth/application/port/out';
import { AuthRepository } from 'src/auth/domain/repository';
import { faker } from '@faker-js/faker/.';
import { generateSecurePassword } from 'src/constants';
import { JwtModule } from '@nestjs/jwt';

describe('SignupService', () => {
  let service: SignupService;
  let userRepository: jest.Mocked<UserRepository>;
  let emailSender: jest.Mocked<EmailSenderOutPort>;
  let authRepository: jest.Mocked<AuthRepository>;
  let generateJwtService: jest.Mocked<GenerateJwtService>;
  beforeEach(async () => {
    userRepository = {
      existsByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    emailSender = {
      sendWelcomeEmail: jest.fn(),
      sendEmailVerifyCode: jest.fn(),
    };

    authRepository = {
      saveRefreshToken: jest.fn(),
    };

    generateJwtService = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<GenerateJwtService>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        SignupService,
        { provide: GenerateJwtService, useValue: generateJwtService },
        { provide: USER_REPOSITORY, useValue: userRepository },
        { provide: EMAIL_SENDER, useValue: emailSender },
        { provide: AUTH_REPOSITORY, useValue: authRepository },
      ],
    }).compile();

    service = module.get<SignupService>(SignupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const validEmail = faker.internet.email();
  const validPassword = generateSecurePassword();

  it('should return error for invalid email', async () => {
    const invalidEmail = 'invalid-email';

    const result = await service.execute({
      email: invalidEmail,
      password: validPassword,
    });

    if (result.isOk()) throw new Error('result is ok');
    expect(result.isErr()).toBe(true);
    expect(result.error).toBe(AuthError.INVALID_EMAIL);
  });

  it('should return error for invalid password', async () => {
    const invalidPassword = 'invalid-password';

    const result = await service.execute({
      email: validEmail,
      password: invalidPassword,
    });

    if (result.isOk()) throw new Error('result is ok');
    expect(result.isErr()).toBe(true);
    expect(result.error).toBe(AuthError.INVALID_PASSWORD);
  });

  it('should return error if email already exists', async () => {
    userRepository.existsByEmail.mockResolvedValue(true);

    const result = await service.execute({
      email: validEmail,
      password: validPassword,
    });

    if (result.isOk()) throw new Error('result is ok');
    expect(result.isErr()).toBe(true);
    expect(result.error).toBe(AuthError.EXISTS_EMAIL);
  });

  it('should successfully sign up a user and return tokens', async () => {
    const refreshToken = 'refreshToken';
    const accessToken = 'accessToken';
    const mockUser = User.create({
      id: faker.string.uuid(),
      email: validEmail,
    });
    if (mockUser.isErr()) throw new Error('mockUser is err');

    userRepository.existsByEmail.mockResolvedValue(false);
    userRepository.createUser.mockResolvedValue(mockUser.value);
    generateJwtService.generate.mockResolvedValue({
      refreshToken,
      accessToken,
    });

    // Execute
    const result = await service.execute({
      email: validEmail,
      password: validPassword,
    });

    // Assert
    if (result.isErr()) throw new Error('result is err');
    expect(result.isOk()).toBe(true);
    expect(result.value).toEqual({
      accessToken,
      refreshToken,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(generateJwtService.generate).toHaveBeenCalledWith(mockUser.value);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authRepository.saveRefreshToken).toHaveBeenCalledWith(mockUser.value, refreshToken);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(emailSender.sendWelcomeEmail).toHaveBeenCalled();
  });
});
