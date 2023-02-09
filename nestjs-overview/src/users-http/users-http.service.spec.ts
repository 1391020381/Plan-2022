import { Test, TestingModule } from '@nestjs/testing';
import { UsersHttpService } from './users-http.service';

describe('UsersHttpService', () => {
  let service: UsersHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersHttpService],
    }).compile();

    service = module.get<UsersHttpService>(UsersHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
