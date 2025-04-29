import { Test, TestingModule } from '@nestjs/testing';
import { GenerateJwtService } from './generateJwt.service';

describe('GenerateJwtService', () => {
  let service: GenerateJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateJwtService],
    }).compile();

    service = module.get<GenerateJwtService>(GenerateJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
