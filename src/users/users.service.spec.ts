/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Users } from '../entities/Users';
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

export const mockUsersRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
};

export const mockUsersSerivce = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
};

describe('UsersService', () => {
  let usersService: UsersService;
  let user;
  let password;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);

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
    expect(usersService).toBeDefined();
  });

  describe('create user', () => {
    it('success', async () => {
      const req = {
        email: user.email,
        password,
        nickname: user.nickname,
        gender: user.gender,
      };

      const expectedResult = user;

      jest.spyOn(mockUsersRepository, 'save').mockResolvedValue(expectedResult);

      const result = await usersService.createUser(
        req.email,
        req.password,
        req.nickname,
        req.gender,
      );
      expect(result).toBeDefined();
      expect(result.userId).toBe(expectedResult.userId);
      expect(result.email).toBe(expectedResult.email);
      expect(result.hashedPassword).not.toBeDefined();
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
        nickname: user.nickname,
        gender: user.gender,
      };

      const expectedError = new InternalServerErrorException();

      jest.spyOn(mockUsersRepository, 'save').mockRejectedValue(new Error());

      await expect(async () => {
        await usersService.createUser(
          req.email,
          password,
          req.nickname,
          req.gender,
        );
      }).rejects.toThrowError(expectedError);
    });

    it('duplicate email', async () => {
      const req = {
        email: user.email,
        password,
        nickname: user.nickname,
        gender: user.gender,
      };

      const expectedErrorMessage = `Duplicate entry '${user.email}' for key 'email'`;
      const expectedError = new BadRequestException(expectedErrorMessage);

      jest.spyOn(mockUsersRepository, 'save').mockRejectedValue({
        code: 'ER_DUP_ENTRY',
        sqlMessage: expectedErrorMessage,
      });

      await expect(async () => {
        await usersService.createUser(
          req.email,
          password,
          req.nickname,
          req.gender,
        );
      }).rejects.toThrowError(expectedError);
    });

    it('duplicate nickname', async () => {
      const req = {
        email: user.email,
        password,
        nickname: user.nickname,
        gender: user.gender,
      };

      const expectedErrorMessage = `Duplicate entry '${user.nickname}' for key 'nickname'`;
      const expectedError = new BadRequestException(expectedErrorMessage);

      jest.spyOn(mockUsersRepository, 'save').mockRejectedValue({
        code: 'ER_DUP_ENTRY',
        sqlMessage: expectedErrorMessage,
      });

      await expect(async () => {
        await usersService.createUser(
          req.email,
          password,
          req.nickname,
          req.gender,
        );
      }).rejects.toThrowError(expectedError);
    });
  });

  describe('find user by email', () => {
    it('success', async () => {
      const req = {
        email: user.email,
      };

      const { salt, ...expectedResult } = user;

      jest
        .spyOn(mockUsersRepository, 'findOne')
        .mockResolvedValue(expectedResult);

      const result = await usersService.findUserByEmail(req.email);
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
      };

      const expectedError = new InternalServerErrorException();

      jest.spyOn(mockUsersRepository, 'findOne').mockRejectedValue(new Error());

      await expect(async () => {
        await usersService.findUserByEmail(req.email);
      }).rejects.toThrowError(expectedError);
    });

    it('not found user', async () => {
      const req = {
        email: user.email,
      };

      const expectedError = new BadRequestException('not found user');

      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(null);

      await expect(async () => {
        await usersService.findUserByEmail(req.email);
      }).rejects.toThrowError(expectedError);
    });
  });
});
