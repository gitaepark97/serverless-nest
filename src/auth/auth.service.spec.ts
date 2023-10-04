/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Sessions } from '../entities/Sessions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import {
  mockUsersRepository,
  mockUsersSerivce,
} from '../users/users.service.spec';
import {
  createRandomEmail,
  createRandomGender,
  createRandomInt,
  createRandomString,
} from '../../test/utils/random.util';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockSessionsRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let user;
  let password;
  let userAgent;
  let clientIp;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersSerivce,
        },
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

    authService = module.get<AuthService>(AuthService);

    userAgent = createRandomString(20);
    clientIp = createRandomString(10);
    password = createRandomString(8);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user = {
      userId: createRandomInt(1, 10),
      email: createRandomEmail(),
      hashedPassword,
      salt,
      nickname: createRandomString(10),
      gender: createRandomGender(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('success', async () => {
      const req = {
        email: user.email,
        password,
        nickname: user.nickname,
        gender: user.gender,
      };

      const { hashedPassword, salt, ...expectedResult } = user;

      jest
        .spyOn(mockUsersSerivce, 'createUser')
        .mockResolvedValue(expectedResult);

      const result = await authService.register(req);
      expect(result).toBeDefined();
      expect(result.userId).toBe(expectedResult.userId);
      expect(result.email).toBe(expectedResult.email);
      expect(result.hashedPassword).toBe(expectedResult.hashedPassword);
      expect(result.salt).not.toBeDefined();
      expect(result.nickname).toBe(expectedResult.nickname);
      expect(result.gender).toBe(expectedResult.gender);
      expect(result.createdAt).toEqual(expectedResult.createdAt);
      expect(result.updatedAt).toEqual(expectedResult.updatedAt);
    });
  });

  describe('validate user', () => {
    it('success', async () => {
      const req = {
        email: user.email,
        password,
      };

      const { salt, hashedPassword, ...expectedResult } = user;

      jest
        .spyOn(mockUsersSerivce, 'findUserByEmail')
        .mockResolvedValue({ hashedPassword, ...expectedResult });

      const result = await authService.validateUser(req.email, req.password);
      expect(result).toBeDefined();
      expect(result.userId).toBe(expectedResult.userId);
      expect(result.email).toBe(expectedResult.email);
      expect(result.hashedPassword).toBe(expectedResult.hashedPassword);
      expect(result.salt).not.toBeDefined();
      expect(result.nickname).toBe(expectedResult.nickname);
      expect(result.gender).toBe(expectedResult.gender);
      expect(result.createdAt).toEqual(expectedResult.createdAt);
      expect(result.updatedAt).toEqual(expectedResult.updatedAt);
    });

    it('internal server error', async () => {
      const req = {
        email: user.email,
        password,
      };

      const expectedError = new InternalServerErrorException();

      jest
        .spyOn(mockUsersSerivce, 'findUserByEmail')
        .mockResolvedValue(new Error());

      await expect(async () => {
        await authService.validateUser(req.email, req.password);
      }).rejects.toThrowError(expectedError);
    });

    it('wrong password', async () => {
      const req = {
        email: user.email,
        password: createRandomString(8),
      };

      const expectedError = new BadRequestException('wrong password');

      const { salt, ...existedUser } = user;

      jest
        .spyOn(mockUsersSerivce, 'findUserByEmail')
        .mockResolvedValue(existedUser);

      await expect(async () => {
        await authService.validateUser(req.email, req.password);
      }).rejects.toThrowError(expectedError);
    });
  });
});
