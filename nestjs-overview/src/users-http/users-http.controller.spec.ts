import { Test, TestingModule } from '@nestjs/testing';
import { UsersHttpController } from './users-http.controller';
import { UsersHttpService } from './users-http.service';

describe('UsersHttpController', () => {
  let controller: UsersHttpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersHttpController],
      providers: [UsersHttpService],
    }).compile();

    controller = module.get<UsersHttpController>(UsersHttpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
