import { Test, TestingModule } from '@nestjs/testing';
import { UserPrismaRepository } from './user.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserEmail } from 'src/auth/domain/entity';
import { faker } from '@faker-js/faker/.';
import { LocalStorageModule } from 'src/common/localStorage/localStorage.module';

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
    it('이미 가입된 이메일이면 true 를 리턴한다.', async () => {
      const newEmail = faker.internet.email();
      const userEmail = UserEmail.create(newEmail);
      if (userEmail.isErr()) throw new Error('');

      const result = await repository.existsByEmail(userEmail.value);

      expect(result).toBe(false);
    });

    it('가입되지 않은 이메일이면 false 를 리턴한다.', async () => {
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
});
