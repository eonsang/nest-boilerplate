import { Test, TestingModule } from '@nestjs/testing';
import { CheckDeplicateEmailService } from './checkDeplicateEmail.service';

describe('CheckDeplicateEmailService', () => {
  let service: CheckDeplicateEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckDeplicateEmailService],
    }).compile();

    service = module.get<CheckDeplicateEmailService>(
      CheckDeplicateEmailService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
