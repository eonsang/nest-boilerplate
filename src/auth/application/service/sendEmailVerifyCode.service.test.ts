import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailVerifyCodeService } from './sendEmailVerifyCode.service';
import { USER_REPOSITORY, UserRepository } from 'src/auth/domain/repository';
import { faker } from '@faker-js/faker';
import { AuthError } from '../error';
import {
  EMAIL_SENDER,
  EmailSenderOutPort,
  EMAIL_VERIFICATION_STORE,
  EmailVerificationStoreOutPort,
} from '../port/out';
import { EmailVerifyCode, UserEmail } from 'src/auth/domain/entity';

jest.mock('random-string-generator', () => {
  return jest.fn().mockReturnValue('683823');
});

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('SendEmailVerifyCodeService', () => {
  let service: SendEmailVerifyCodeService;
  let userRepository: UserRepository;
  let emailVerificationStore: EmailVerificationStoreOutPort;
  let emailSender: EmailSenderOutPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailVerifyCodeService,
        {
          provide: USER_REPOSITORY,
          useValue: {
            existsByEmail: jest.fn(),
          },
        },
        {
          provide: EMAIL_VERIFICATION_STORE,
          useValue: {
            saveVerificationCode: jest.fn(),
          },
        },
        {
          provide: EMAIL_SENDER,
          useValue: {
            sendEmailVerifyCode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SendEmailVerifyCodeService>(
      SendEmailVerifyCodeService,
    );
    userRepository = module.get<UserRepository>(USER_REPOSITORY);
    emailVerificationStore = module.get<EmailVerificationStoreOutPort>(
      EMAIL_VERIFICATION_STORE,
    );
    emailSender = module.get<EmailSenderOutPort>(EMAIL_SENDER);
  });

  it(`should return err(INVALID_EMAIL) when invalid email`, async () => {
    const email = 'invalid-email';
    const result = await service.execute(email);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(AuthError.INVALID_EMAIL);
  });

  it(`should return err(EXISTS_EMAIL) when email is already registered`, async () => {
    const email = faker.internet.email();
    jest.spyOn(userRepository, 'existsByEmail').mockResolvedValue(true);

    const result = await service.execute(email);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(AuthError.EXISTS_EMAIL);
  });

  it(`should send email and return true`, async () => {
    const email = faker.internet.email();

    const userEmail = UserEmail.create(email);
    const emailVerifyCode = EmailVerifyCode.create('683823');

    if (userEmail.isErr()) throw new Error('throw error');
    if (emailVerifyCode.isErr()) throw new Error('throw error');

    jest.spyOn(userRepository, 'existsByEmail').mockResolvedValue(false);

    const result = await service.execute(email);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(emailVerificationStore.saveVerificationCode).toHaveBeenCalledWith(
      userEmail.value,
      emailVerifyCode.value,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(emailSender.sendEmailVerifyCode).toHaveBeenCalledWith(
      userEmail.value,
      emailVerifyCode.value,
    );

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(true);
  });
});
