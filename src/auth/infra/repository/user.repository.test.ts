import { Test, TestingModule } from '@nestjs/testing';
import { UserPrismaRepository } from './user.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { EmailSignupUser, UserEmail, UserPassword } from 'src/auth/domain/entity';
import { faker } from '@faker-js/faker/.';
import { LocalStorageModule } from 'src/common/localStorage/localStorage.module';
import { generateSecurePassword } from 'src/constants';

describe('UserPrismaRepository', () => {
  let repository: UserPrismaRepository;
  let prismaService: PrismaService;
  const email = faker.internet.email();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LocalStorageModule],
      providers: [UserPrismaRepository],
    }).compile();

    repository = module.get<UserPrismaRepository>(UserPrismaRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({});
    await prismaService.$disconnect();
  });

  describe('existsByEmail', () => {
    it('should return true if email is registered.', async () => {
      const newEmail = faker.internet.email();
      const userEmail = UserEmail.create(newEmail);
      if (userEmail.isErr()) throw new Error('');

      const result = await repository.existsByEmail(userEmail.value);

      expect(result).toBe(false);
    });

    it('should return false if email is not registered.', async () => {
      await prismaService.user.create({
        data: {
          email,
          name: faker.person.fullName(),
        },
      });

      const userEmail = UserEmail.create(email);
      if (userEmail.isErr()) throw new Error('');

      const result = await repository.existsByEmail(userEmail.value);

      expect(result).toBe(true);
    });
  });

  describe('createUser', () => {
    it('should return user if user is created', async () => {
      const email = UserEmail.create(faker.internet.email());
      if (email.isErr()) throw new Error('email is err');
      const password = UserPassword.create(generateSecurePassword());
      if (password.isErr()) throw new Error('password is err');
      const signupUser = EmailSignupUser.create({
        email: email.value,
        password: password.value,
      });
      if (signupUser.isErr()) throw new Error('signupUser is err');

      const result = await repository.createUser(signupUser.value);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.email.value).toBe(email.value.value);
    });
  });
});
