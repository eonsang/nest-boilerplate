import { Test, TestingModule } from '@nestjs/testing';
import { GenerateJwtService } from './generateJwt.service';
import { JwtModule } from '@nestjs/jwt';

describe('GenerateJwtService', () => {
  let service: GenerateJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [GenerateJwtService],
    }).compile();

    service = module.get<GenerateJwtService>(GenerateJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
