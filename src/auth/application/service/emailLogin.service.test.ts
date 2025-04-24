import { Test, TestingModule } from '@nestjs/testing';
import { EmailLoginService } from './emailLogin.service';

describe('EmailLoginService', () => {
  let service: EmailLoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailLoginService],
    }).compile();

    service = module.get<EmailLoginService>(EmailLoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
