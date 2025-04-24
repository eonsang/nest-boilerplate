import { Test, TestingModule } from '@nestjs/testing';
import { FindPasswordService } from './findPassword.service';

describe('FindPasswordService', () => {
  let service: FindPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindPasswordService],
    }).compile();

    service = module.get<FindPasswordService>(FindPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
