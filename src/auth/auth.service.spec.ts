import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Sessions } from '../entities/Sessions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { mockUsersRepository } from '../users/users.service.spec';

const mockSessionsRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
        JwtService,
        ConfigService,
        {
          provide: getRepositoryToken(Sessions),
          useValue: mockSessionsRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
