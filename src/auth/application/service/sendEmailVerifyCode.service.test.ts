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

jest.mock('random-string-generator', () => {
  return jest.fn().mockReturnValue('683823');
});

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
            save: jest.fn(),
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

  it(`잘못된 이메일 형식이면, 오류를 응답한다. (${AuthError.INVALID_EMAIL.code})`, async () => {
    const email = 'invalid-email';
    const result = await service.execute(email);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(AuthError.INVALID_EMAIL);
  });

  it(`이미 가입된 이메일이면, 오류를 응답한다. (${AuthError.EXISTS_EMAIL.code})`, async () => {
    const email = faker.internet.email();
    jest.spyOn(userRepository, 'existsByEmail').mockResolvedValue(true);

    const result = await service.execute(email);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(AuthError.EXISTS_EMAIL);
  });

  it(`이메일이 발송되고, true를 응답한다.`, async () => {
    const email = faker.internet.email();
    jest.spyOn(userRepository, 'existsByEmail').mockResolvedValue(false);

    const result = await service.execute(email);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(emailVerificationStore.save).toHaveBeenCalledWith(email, '683823');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(emailSender.sendEmailVerifyCode).toHaveBeenCalledWith(
      email,
      '683823',
    );

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(true);
  });
});
