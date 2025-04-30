import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from 'src/auth/domain/entity';
import { faker } from '@faker-js/faker/.';
import { LocalStorageModule } from 'src/common/localStorage/localStorage.module';
import { AuthRepository } from './auth.repository';
import { CacheModule } from 'src/common/cache/cache.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LocalStorageModule, CacheModule, PrismaModule],
      providers: [AuthRepository],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({});
    await prismaService.$disconnect();
  });

  describe('saveRefreshToken', () => {
    it('should return error if user is not found', async () => {
      const user = User.create({
        id: faker.number.int({ max: 10000 }).toString(),
        email: faker.internet.email(),
      });
      if (user.isErr()) throw new Error('user is err');

      try {
        await repository.saveRefreshToken(user.value, faker.string.uuid());
        throw new Error('should not be here');
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('should pass if user is found', async () => {
      const user = await prismaService.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      });
      const savedUser = User.create({
        id: user.id.toString(),
        email: user.email,
      });
      if (savedUser.isErr()) throw new Error('user is err');

      const refreshToken = faker.string.uuid();
      try {
        await repository.saveRefreshToken(savedUser.value, refreshToken);
      } catch (e) {
        throw new Error('should not be here');
      }
    });
  });
});
